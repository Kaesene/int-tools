import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { zipCode, items } = body

    console.log('📦 Calculando frete:', { zipCode, items })

    if (!zipCode || !items || items.length === 0) {
      return NextResponse.json({ error: 'CEP e itens sao obrigatorios' }, { status: 400 })
    }

    // Buscar produtos para pegar peso e dimensoes
    const productIds = items.map((item: any) => parseInt(item.productId))
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        shippingWeight: true,
        shippingWidth: true,
        shippingHeight: true,
        shippingLength: true,
        freeShipping: true,
      },
    })

    console.log('📦 Produtos encontrados:', products)

    // Verificar se todos tem frete gratis
    const allFreeShipping = products.every(p => p.freeShipping)
    if (allFreeShipping) {
      console.log('✅ Todos os produtos tem frete gratis')
      return NextResponse.json({
        options: [
          {
            id: 'free',
            name: 'Frete Gratis',
            price: 0,
            delivery_time: 7,
            company: {
              name: 'Frete Gratis',
              picture: '',
            },
          },
        ],
      })
    }

    // Calcular peso e dimensoes totais do pacote
    let totalWeight = 0
    let maxWidth = 0
    let maxHeight = 0
    let totalLength = 0

    items.forEach((item: any) => {
      const product = products.find(p => p.id === parseInt(item.productId))
      if (product) {
        const quantity = item.quantity || 1
        totalWeight += Number(product.shippingWeight || 0.3) * quantity
        maxWidth = Math.max(maxWidth, Number(product.shippingWidth || 11))
        maxHeight = Math.max(maxHeight, Number(product.shippingHeight || 17))
        totalLength += Number(product.shippingLength || 11) * quantity
      }
    })

    // Limites minimos e maximos dos Correios
    totalWeight = Math.max(0.3, Math.min(30, totalWeight))
    maxWidth = Math.max(11, Math.min(105, maxWidth))
    maxHeight = Math.max(2, Math.min(105, maxHeight))
    totalLength = Math.max(16, Math.min(105, totalLength))

    console.log('📐 Dimensoes do pacote:', {
      weight: totalWeight,
      width: maxWidth,
      height: maxHeight,
      length: totalLength,
    })

    // Chamar API do Melhor Envio
    const melhorEnvioToken = process.env.MELHOR_ENVIO_TOKEN

    if (!melhorEnvioToken) {
      console.warn('⚠️ Token do Melhor Envio nao configurado, retornando frete fixo')
      return NextResponse.json({
        options: [
          {
            id: '1',
            name: 'PAC',
            price: 15.00,
            delivery_time: 10,
            company: {
              name: 'Correios',
              picture: '',
            },
          },
          {
            id: '2',
            name: 'SEDEX',
            price: 25.00,
            delivery_time: 5,
            company: {
              name: 'Correios',
              picture: '',
            },
          },
          {
            id: '17',
            name: 'Loggi Express',
            price: 20.00,
            delivery_time: 2,
            company: {
              name: 'Loggi',
              picture: '',
            },
          },
        ],
      })
    }

    // Limpar CEP (remover pontos e hifens)
    const cleanZipCode = zipCode.replace(/\D/g, '')

    // Payload para Melhor Envio
    const payload = {
      from: {
        postal_code: process.env.SHOP_ZIP_CODE || '01310100', // CEP da sua loja
      },
      to: {
        postal_code: cleanZipCode,
      },
      package: {
        weight: totalWeight,
        width: maxWidth,
        height: maxHeight,
        length: totalLength,
      },
    }

    console.log('🚀 Chamando API Melhor Envio:', payload)

    const response = await fetch('https://melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${melhorEnvioToken}`,
        'User-Agent': 'INT-TOOLS (contato@int-tools.com)',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Erro Melhor Envio:', errorData)

      // Retornar opcoes fixas em caso de erro
      return NextResponse.json({
        options: [
          {
            id: '1',
            name: 'PAC',
            price: 15.00,
            delivery_time: 10,
            company: {
              name: 'Correios',
              picture: '',
            },
          },
          {
            id: '2',
            name: 'SEDEX',
            price: 25.00,
            delivery_time: 5,
            company: {
              name: 'Correios',
              picture: '',
            },
          },
          {
            id: '17',
            name: 'Loggi Express',
            price: 20.00,
            delivery_time: 2,
            company: {
              name: 'Loggi',
              picture: '',
            },
          },
        ],
      })
    }

    const shippingOptions = await response.json()
    console.log('✅ Opcoes de frete:', shippingOptions)

    // IDs das transportadoras permitidas (Melhor Envio)
    // 1 = Correios PAC
    // 2 = Correios SEDEX
    // 17 = Loggi
    const allowedServiceIds = [1, 2, 17]

    // Filtrar apenas PAC, SEDEX e Loggi, e remover opcoes com preco zerado ou erro
    const filteredOptions = shippingOptions.filter((option: any) => {
      const isAllowed = allowedServiceIds.includes(option.id)
      const hasValidPrice = option.price && parseFloat(option.price) > 0
      const noError = !option.error

      return isAllowed && hasValidPrice && noError
    })

    console.log('🔍 Opcoes filtradas (PAC, SEDEX, Loggi):', filteredOptions.map((o: any) => `${o.name} - R$ ${o.price}`))

    // Formatar opcoes
    const formattedOptions = filteredOptions.map((option: any) => ({
      id: option.id.toString(),
      name: option.name,
      price: parseFloat(option.price),
      delivery_time: option.delivery_time,
      company: {
        name: option.company.name,
        picture: option.company.picture,
      },
    }))

    return NextResponse.json({ options: formattedOptions })
  } catch (error: any) {
    console.error('❌ Erro ao calcular frete:', error)

    // Retornar opcoes fixas em caso de erro
    return NextResponse.json({
      options: [
        {
          id: '1',
          name: 'PAC',
          price: 15.00,
          delivery_time: 10,
          company: {
            name: 'Correios',
            picture: '',
          },
        },
        {
          id: '2',
          name: 'SEDEX',
          price: 25.00,
          delivery_time: 5,
          company: {
            name: 'Correios',
            picture: '',
          },
        },
        {
          id: '17',
          name: 'Loggi Express',
          price: 20.00,
          delivery_time: 2,
          company: {
            name: 'Loggi',
            picture: '',
          },
        },
      ],
    })
  }
}
