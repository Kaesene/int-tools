import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
})

const payment = new Payment(client)

// Função auxiliar para aguardar
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id)
    const body = await request.json()
    const { paymentId } = body

    console.log('🔍 Verificando pagamento:', {
      orderId,
      paymentId,
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN?.substring(0, 20) + '...'
    })

    if (!paymentId) {
      return NextResponse.json({ error: 'paymentId is required' }, { status: 400 })
    }

    // Tentar buscar o pagamento com retry (até 3 tentativas)
    let paymentData = null
    let lastError = null

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`🔄 Tentativa ${attempt} de buscar pagamento ${paymentId}`)
        paymentData = await payment.get({ id: paymentId })
        console.log('✅ Pagamento encontrado!')
        break
      } catch (error: any) {
        lastError = error
        console.log(`❌ Tentativa ${attempt} falhou:`, error.message)

        if (attempt < 3) {
          console.log(`⏳ Aguardando ${attempt * 2}s antes de tentar novamente...`)
          await sleep(attempt * 2000) // 2s, 4s
        }
      }
    }

    if (!paymentData) {
      console.error('❌ Não foi possível encontrar o pagamento após 3 tentativas')
      throw lastError
    }

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
