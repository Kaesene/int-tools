import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, orderShippedEmail } from '@/lib/email'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id)
    const body = await request.json()
    const { trackingCode } = body

    if (!trackingCode || !trackingCode.trim()) {
      return NextResponse.json({ error: 'Codigo de rastreio e obrigatorio' }, { status: 400 })
    }

    console.log('📦 Atualizando codigo de rastreio:', {
      orderId,
      trackingCode: trackingCode.trim()
    })

    // Atualizar codigo de rastreio e timestamp de envio
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        trackingCode: trackingCode.trim(),
        shippedAt: new Date(), // Marca como enviado automaticamente
        status: 'shipped', // Atualiza status para enviado
        updatedAt: new Date(),
      },
      include: {
        user: true,
      },
    })

    console.log('✅ Codigo de rastreio atualizado com sucesso')

    // Enviar email de pedido enviado
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inttools.com.br'
      const orderUrl = `${siteUrl}/minha-conta/pedidos/${updatedOrder.id}`
      const trackingUrl = `https://rastreamento.correios.com.br/app/index.php?objeto=${updatedOrder.trackingCode}`

      const emailHtml = orderShippedEmail({
        orderNumber: updatedOrder.orderNumber,
        customerName: updatedOrder.user.name || updatedOrder.user.email,
        trackingCode: updatedOrder.trackingCode!,
        trackingUrl,
        orderUrl,
      })

      await sendEmail({
        to: updatedOrder.user.email,
        subject: `Pedido #${updatedOrder.orderNumber} foi enviado! - INT Tools`,
        html: emailHtml,
      })

      console.log('📧 Email de envio enviado para:', updatedOrder.user.email)
    } catch (emailError) {
      console.error('❌ Erro ao enviar email de envio:', emailError)
      // Nao falha a operacao se o email falhar
    }

    return NextResponse.json({
      success: true,
      trackingCode: updatedOrder.trackingCode,
      shippedAt: updatedOrder.shippedAt,
    })
  } catch (error: any) {
    console.error('❌ Erro ao atualizar codigo de rastreio:', error)
    return NextResponse.json(
      {
        error: 'Erro ao atualizar codigo de rastreio',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
