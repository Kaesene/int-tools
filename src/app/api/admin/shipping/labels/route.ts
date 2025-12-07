import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateLabels, printLabels, getShipment } from '@/lib/melhorenvio'
import { sendEmail, orderShippedEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    // Buscar pedido
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
      },
    })

    if (!order || !order.melhorEnvioId) {
      return NextResponse.json(
        { error: 'Pedido não encontrado ou sem envio criado no Melhor Envio' },
        { status: 404 }
      )
    }

    console.log('🏷️ Gerando etiqueta no Melhor Envio:', order.melhorEnvioId)

    // 1. Gerar etiqueta
    await generateLabels([order.melhorEnvioId])

    // 2. Aguardar 2 segundos para processamento
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 3. Buscar informações do envio (inclui tracking code)
    const shipmentInfo = await getShipment(order.melhorEnvioId)
    const trackingCode = shipmentInfo.tracking

    console.log('✅ Código de rastreio obtido:', trackingCode)

    // 4. Obter URL do PDF da etiqueta
    const labelUrl = await printLabels([order.melhorEnvioId])

    // 5. Atualizar pedido com código de rastreio e status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        trackingCode,
        status: 'shipped',
        shippedAt: new Date(),
      },
      include: {
        user: true,
      },
    })

    // 6. Enviar email de envio ao cliente
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const emailHtml = orderShippedEmail({
      orderNumber: updatedOrder.orderNumber,
      customerName: updatedOrder.user.name || updatedOrder.user.email,
      trackingCode: trackingCode!,
      trackingUrl: `https://rastreamento.correios.com.br/app/index.php?objeto=${trackingCode}`,
      orderUrl: `${siteUrl}/minha-conta/pedidos/${updatedOrder.id}`,
    })

    await sendEmail({
      to: updatedOrder.user.email,
      subject: `Pedido #${updatedOrder.orderNumber} foi enviado! - INT Tools`,
      html: emailHtml,
    })

    console.log('✅ Email de envio enviado ao cliente')

    return NextResponse.json({
      success: true,
      trackingCode,
      labelUrl,
      message: 'Etiqueta gerada e código de rastreio obtido com sucesso',
    })
  } catch (error: any) {
    console.error('❌ Erro ao gerar etiqueta:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar etiqueta', details: error.message },
      { status: 500 }
    )
  }
}
