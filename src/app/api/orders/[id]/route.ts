import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id)

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Formatar resposta
    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingName: order.shippingName,
      shippingStreet: order.shippingStreet,
      shippingNumber: order.shippingNumber,
      shippingComplement: order.shippingComplement,
      shippingNeighborhood: order.shippingNeighborhood,
      shippingCity: order.shippingCity,
      shippingState: order.shippingState,
      shippingZipCode: order.shippingZipCode,
      trackingCode: order.trackingCode,
    }

    return NextResponse.json(formattedOrder)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
