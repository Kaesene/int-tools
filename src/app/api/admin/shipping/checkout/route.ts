import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkout } from '@/lib/melhorenvio'

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    // Buscar pedido
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order || !order.melhorEnvioId) {
      return NextResponse.json(
        { error: 'Pedido não encontrado ou sem envio criado no Melhor Envio' },
        { status: 404 }
      )
    }

    console.log('💳 Fazendo checkout no Melhor Envio:', order.melhorEnvioId)

    const result = await checkout([order.melhorEnvioId])

    return NextResponse.json({
      success: true,
      message: 'Checkout realizado com sucesso',
      result,
    })
  } catch (error: any) {
    console.error('❌ Erro ao fazer checkout:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer checkout', details: error.message },
      { status: 500 }
    )
  }
}
