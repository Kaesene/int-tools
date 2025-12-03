import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    })

    console.log('✅ Codigo de rastreio atualizado com sucesso')

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
