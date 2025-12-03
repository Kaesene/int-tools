import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || searchParams.get('customerId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    console.log('🔍 Fetching orders for userId:', userId)

    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Formatar resposta
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
    }))

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📦 Order request body:', JSON.stringify(body, null, 2))

    const {
      userId,
      addressId,
      items,
      subtotal,
      shippingCost,
      discount,
      total,
      shippingName,
      shippingStreet,
      shippingNumber,
      shippingComplement,
      shippingNeighborhood,
      shippingCity,
      shippingState,
      shippingZipCode,
    } = body

    console.log('🔍 Validating fields...', {
      hasUserId: !!userId,
      hasItems: !!items,
      itemsLength: items?.length,
      hasShippingInfo: !!shippingName && !!shippingStreet
    })

    if (!userId || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Criar pedido com items (orderNumber temporário)
    console.log('💾 Creating order in database...')
    const order = await prisma.order.create({
      data: {
        orderNumber: 'TEMP', // Temporário, será atualizado
        userId,
        addressId: addressId || null,
        subtotal: Number(subtotal),
        shippingCost: Number(shippingCost || 0),
        discount: Number(discount || 0),
        total: Number(total),
        status: 'pending',
        paymentStatus: 'pending',
        shippingName,
        shippingStreet,
        shippingNumber,
        shippingComplement: shippingComplement || null,
        shippingNeighborhood,
        shippingCity,
        shippingState,
        shippingZipCode,
        items: {
          create: items.map((item: any) => {
            const productId = parseInt(item.productId)
            console.log('🔗 Creating order item:', {
              productId,
              originalId: item.productId,
              isValidId: !isNaN(productId)
            })

            return {
              product: {
                connect: { id: productId }
              },
              productName: item.productName,
              productImage: item.productImage || null,
              quantity: Number(item.quantity),
              price: Number(item.price),
            }
          }),
        },
      },
      include: {
        items: true,
      },
    })

    // Gerar número do pedido formatado com padding (ex: #0001, #0002)
    const orderNumber = order.id.toString().padStart(4, '0')
    console.log('🎯 Order number generated:', orderNumber)

    // Atualizar pedido com orderNumber correto
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { orderNumber },
      include: { items: true },
    })

    console.log('✅ Order created successfully:', updatedOrder.id)
    return NextResponse.json(updatedOrder, { status: 201 })
  } catch (error: any) {
    console.error('❌ Error creating order:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    return NextResponse.json({
      error: 'Internal Server Error',
      details: error.message
    }, { status: 500 })
  }
}
