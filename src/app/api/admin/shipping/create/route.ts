import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addToCart, getServiceId } from '@/lib/melhorenvio'

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    // Buscar pedido com endereço e produtos
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order || !order.address) {
      return NextResponse.json({ error: 'Pedido ou endereço não encontrado' }, { status: 404 })
    }

    // Calcular peso e dimensões totais dos produtos
    let totalWeight = 0
    let maxWidth = 0
    let maxHeight = 0
    let totalLength = 0

    order.items.forEach((item) => {
      const product = item.product
      totalWeight += Number(product.shippingWeight || 0.5) * item.quantity
      maxWidth = Math.max(maxWidth, product.shippingWidth || 20)
      maxHeight = Math.max(maxHeight, product.shippingHeight || 15)
      totalLength += (product.shippingLength || 10) * item.quantity
    })

    // Dados da loja (origem)
    const shopData = {
      name: 'INT Tools',
      phone: process.env.SHOP_PHONE || '15998765432',
      email: process.env.EMAIL_FROM || 'noreply@inttools.com.br',
      document: process.env.SHOP_DOCUMENT || '12345678901',
      address: process.env.SHOP_ADDRESS || 'Rua Principal',
      number: process.env.SHOP_NUMBER || '100',
      district: process.env.SHOP_DISTRICT || 'Centro',
      city: process.env.SHOP_CITY || 'Marília',
      state_abbr: process.env.SHOP_STATE || 'SP',
      postal_code: (process.env.SHOP_ZIP_CODE || '17520110').replace('-', ''),
    }

    // Dados do cliente (destino) - pega do order ou address
    const customerData = {
      name: order.shippingName,
      phone: order.shippingPhone || order.address?.phone || order.user.phone || '15998765432',
      email: order.user.email,
      document: order.shippingCpf || order.address?.cpf || order.user.cpf || '12345678901',
      address: order.shippingStreet,
      complement: order.shippingComplement,
      number: order.shippingNumber,
      district: order.shippingNeighborhood,
      city: order.shippingCity,
      state_abbr: order.shippingState,
      postal_code: order.shippingZipCode.replace('-', ''),
    }

    // Preparar produtos para declaração
    const products = order.items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      unitary_value: Number(item.price),
    }))

    // Criar envio no Melhor Envio
    const shipmentData = {
      service: getServiceId(order.shippingMethod || 'PAC'),
      from: shopData,
      to: customerData,
      products,
      package: {
        weight: totalWeight,
        width: maxWidth,
        height: maxHeight,
        length: totalLength,
      },
      options: {
        insurance_value: Number(order.total),
        receipt: false,
        own_hand: false,
        collect: false,
        reverse: false,
        non_commercial: false,
      },
    }

    console.log('📦 Criando envio no Melhor Envio:', shipmentData)

    const result = await addToCart(shipmentData)

    // Salvar ID do Melhor Envio no pedido
    await prisma.order.update({
      where: { id: orderId },
      data: {
        melhorEnvioId: result.id,
      },
    })

    return NextResponse.json({
      success: true,
      melhorEnvioId: result.id,
      message: 'Envio adicionado ao carrinho do Melhor Envio',
    })
  } catch (error: any) {
    console.error('❌ Erro ao criar envio:', error)
    return NextResponse.json(
      { error: 'Erro ao criar envio', details: error.message },
      { status: 500 }
    )
  }
}
