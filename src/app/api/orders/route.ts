import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || searchParams.get('customerId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const orders = await prisma.order.findMany({
      where: {
        userId,
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

    // Gerar número do pedido único
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`
    console.log('🎯 Order number generated:', orderNumber)

    // Criar pedido com items
    console.log('💾 Creating order in database...')
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        addressId,
        subtotal,
        shippingCost: shippingCost || 0,
        discount: discount || 0,
        total,
        status: 'pending',
        paymentStatus: 'pending',
        shippingName,
        shippingStreet,
        shippingNumber,
        shippingComplement,
        shippingNeighborhood,
        shippingCity,
        shippingState,
        shippingZipCode,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    console.log('✅ Order created successfully:', order.id)
    return NextResponse.json(order, { status: 201 })
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
