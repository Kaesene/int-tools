import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// Configurar Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
})

const payment = new Payment(client)

// Validar assinatura do webhook
function validateWebhookSignature(request: NextRequest, body: any): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET

  // Se não tiver secret configurado, pular validação (modo dev)
  if (!secret) {
    console.warn('⚠️ MERCADOPAGO_WEBHOOK_SECRET não configurado - validação desabilitada')
    return true
  }

  try {
    // Extrair headers
    const xSignature = request.headers.get('x-signature')
    const xRequestId = request.headers.get('x-request-id')

    if (!xSignature || !xRequestId) {
      console.error('Headers de assinatura não encontrados')
      return false
    }

    // Extrair ts e hash do x-signature
    // Formato: "ts=1234567890,v1=abc123..."
    const parts = xSignature.split(',')
    let ts = ''
    let hash = ''

    for (const part of parts) {
      const [key, value] = part.split('=')
      if (key === 'ts') ts = value
      if (key === 'v1') hash = value
    }

    if (!ts || !hash) {
      console.error('Timestamp ou hash não encontrado no x-signature')
      return false
    }

    // Obter data.id do body
    const dataId = body.data?.id || ''

    // Criar string para assinar: id + request-id + ts
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`

    // Calcular HMAC SHA256
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(manifest)
    const calculatedHash = hmac.digest('hex')

    // Comparar hashes
    const isValid = calculatedHash === hash

    if (!isValid) {
      console.error('❌ Assinatura inválida!')
      console.error('Manifest:', manifest)
      console.error('Hash esperado:', hash)
      console.error('Hash calculado:', calculatedHash)
    } else {
      console.log('✅ Assinatura validada com sucesso')
    }

    return isValid
  } catch (error) {
    console.error('Erro ao validar assinatura:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('Webhook Mercado Pago recebido:', body)

    // VALIDAR ASSINATURA (segurança)
    if (!validateWebhookSignature(request, body)) {
      console.error('⛔ Webhook rejeitado - assinatura inválida')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

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
