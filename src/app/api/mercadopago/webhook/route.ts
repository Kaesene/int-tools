import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'

// Configurar Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
})

const payment = new Payment(client)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('Webhook Mercado Pago recebido:', body)

    // Mercado Pago envia notificações de diferentes tipos
    // Vamos processar apenas notificações de pagamento
    if (body.type === 'payment') {
      const paymentId = body.data?.id

      if (!paymentId) {
        return NextResponse.json({ error: 'Payment ID not found' }, { status: 400 })
      }

      // Buscar detalhes do pagamento
      const paymentData = await payment.get({ id: paymentId })

      console.log('Pagamento detalhado:', paymentData)

      // Extrair ID do pedido da referência externa
      const orderId = paymentData.external_reference
        ? parseInt(paymentData.external_reference)
        : null

      if (!orderId) {
        console.error('Order ID não encontrado no pagamento')
        return NextResponse.json({ error: 'Order ID not found' }, { status: 400 })
      }

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
        include: {
          items: true,
        },
      })

      console.log(`Pedido #${orderId} atualizado: ${orderStatus} / ${paymentStatus}`)

      // DECREMENTAR ESTOQUE quando pagamento aprovado
      if (paymentData.status === 'approved') {
        console.log(`Decrementando estoque do pedido #${orderId}...`)

        for (const item of updatedOrder.items) {
          try {
            await prisma.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            })
            console.log(`Estoque decrementado: Produto #${item.productId} - ${item.quantity} unidades`)
          } catch (error) {
            console.error(`Erro ao decrementar estoque do produto #${item.productId}:`, error)
          }
        }
      }

      // INCREMENTAR ESTOQUE se pedido for cancelado/rejeitado E já tinha sido pago antes
      if ((paymentData.status === 'rejected' || paymentData.status === 'cancelled') && updatedOrder.paidAt) {
        console.log(`Incrementando estoque do pedido cancelado #${orderId}...`)

        for (const item of updatedOrder.items) {
          try {
            await prisma.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            })
            console.log(`Estoque incrementado: Produto #${item.productId} + ${item.quantity} unidades`)
          } catch (error) {
            console.error(`Erro ao incrementar estoque do produto #${item.productId}:`, error)
          }
        }
      }
    }

    // Sempre retornar 200 para o Mercado Pago
    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Erro ao processar webhook Mercado Pago:', error)
    // Sempre retornar 200 mesmo com erro para não receber a notificação novamente
    return NextResponse.json({ error: error.message })
  }
}

// Também permitir GET para teste
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Webhook Mercado Pago funcionando',
    timestamp: new Date().toISOString(),
  })
}
