import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, paymentApprovedEmail, orderDeliveredEmail } from '@/lib/email'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id)
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: 'Status e obrigatorio' }, { status: 400 })
    }

    const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Status invalido' }, { status: 400 })
    }

    console.log('📝 Atualizando status do pedido:', {
      orderId,
      newStatus: status
    })

    // Buscar pedido anterior para comparar status
    const previousOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    })

    if (!previousOrder) {
      return NextResponse.json({ error: 'Pedido nao encontrado' }, { status: 404 })
    }

    // Atualizar status
    const data: any = {
      status,
      updatedAt: new Date(),
    }

    // Atualizar timestamps especificos
    if (status === 'paid' && previousOrder.status !== 'paid') {
      data.paidAt = new Date()
      data.paymentStatus = 'approved'
    }

    if (status === 'shipped' && previousOrder.status !== 'shipped') {
      data.shippedAt = new Date()
    }

    if (status === 'delivered' && previousOrder.status !== 'delivered') {
      data.deliveredAt = new Date()
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data,
      include: {
        user: true,
      },
    })

    console.log('✅ Status atualizado com sucesso')

    // Enviar emails baseados na mudanca de status
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inttools.com.br'
    const orderUrl = `${siteUrl}/minha-conta/pedidos/${updatedOrder.id}`

    try {
      // Email de pagamento aprovado
      if (status === 'paid' && previousOrder.status !== 'paid') {
        const emailHtml = paymentApprovedEmail({
          orderNumber: updatedOrder.orderNumber,
          customerName: updatedOrder.user.name || updatedOrder.user.email,
          orderUrl,
        })

        await sendEmail({
          to: updatedOrder.user.email,
          subject: `Pagamento aprovado - Pedido #${updatedOrder.orderNumber} - INT Tools`,
          html: emailHtml,
        })

        console.log('📧 Email de pagamento aprovado enviado')
      }

      // Email de pedido entregue
      if (status === 'delivered' && previousOrder.status !== 'delivered') {
        const emailHtml = orderDeliveredEmail({
          orderNumber: updatedOrder.orderNumber,
          customerName: updatedOrder.user.name || updatedOrder.user.email,
          orderUrl,
        })

        await sendEmail({
          to: updatedOrder.user.email,
          subject: `Pedido entregue - #${updatedOrder.orderNumber} - INT Tools`,
          html: emailHtml,
        })

        console.log('📧 Email de pedido entregue enviado')
      }
    } catch (emailError) {
      console.error('❌ Erro ao enviar email:', emailError)
      // Nao falha a operacao se o email falhar
    }

    return NextResponse.json({
      success: true,
      status: updatedOrder.status,
      paidAt: updatedOrder.paidAt,
      shippedAt: updatedOrder.shippedAt,
      deliveredAt: updatedOrder.deliveredAt,
    })
  } catch (error: any) {
    console.error('❌ Erro ao atualizar status:', error)
    return NextResponse.json(
      {
        error: 'Erro ao atualizar status',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
