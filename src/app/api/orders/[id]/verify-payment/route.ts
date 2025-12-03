import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
})

const payment = new Payment(client)

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id)
    const body = await request.json()
    const { paymentId } = body

    console.log('🔍 Verificando pagamento:', { orderId, paymentId })

    if (!paymentId) {
      return NextResponse.json({ error: 'paymentId is required' }, { status: 400 })
    }

    // Buscar detalhes do pagamento no Mercado Pago
    const paymentData = await payment.get({ id: paymentId })

    console.log('💳 Dados do pagamento:', {
      id: paymentData.id,
      status: paymentData.status,
      external_reference: paymentData.external_reference,
    })

    // Atualizar status do pedido baseado no status do pagamento
    let orderStatus = 'pending'
    let paymentStatus = 'pending'

    switch (paymentData.status) {
      case 'approved':
        orderStatus = 'paid'
        paymentStatus = 'approved'
        break
      case 'pending':
      case 'in_process':
        orderStatus = 'pending'
        paymentStatus = 'pending'
        break
      case 'rejected':
      case 'cancelled':
        orderStatus = 'cancelled'
        paymentStatus = 'rejected'
        break
    }

    // Atualizar pedido no banco
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: orderStatus,
        paymentStatus,
        paymentMethod: paymentData.payment_method_id || null,
        paymentId: paymentId.toString(),
        paidAt: paymentData.status === 'approved' ? new Date() : null,
        updatedAt: new Date(),
      },
    })

    console.log(`✅ Pedido #${orderId} atualizado: ${orderStatus} / ${paymentStatus}`)

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      paymentStatus: paymentData.status,
    })
  } catch (error: any) {
    console.error('❌ Erro ao verificar pagamento:', error)
    return NextResponse.json(
      {
        error: 'Erro ao verificar pagamento',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
