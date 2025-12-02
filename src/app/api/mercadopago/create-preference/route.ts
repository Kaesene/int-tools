import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

// Configurar Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
  options: { timeout: 5000 }
})

const preference = new Preference(client)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, orderNumber, items, total, payer } = body

    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Mercado Pago não configurado. Configure MERCADOPAGO_ACCESS_TOKEN no .env' },
        { status: 500 }
      )
    }

    // Criar preferência de pagamento
    const preferenceData = {
      body: {
        items: items.map((item: any) => ({
          id: item.id.toString(),
          title: item.name,
          description: item.name,
          picture_url: item.thumbnail,
          category_id: 'tools',
          quantity: item.quantity,
          currency_id: 'BRL',
          unit_price: item.price,
        })),
        payer: {
          name: payer?.name,
          email: payer?.email,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/${orderId}/sucesso`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/${orderId}/falha`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/${orderId}/pendente`,
        },
        auto_return: 'approved' as const,
        external_reference: orderId.toString(),
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/mercadopago/webhook`,
        statement_descriptor: 'INT TOOLS',
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      },
    }

    const response = await preference.create(preferenceData)

    return NextResponse.json({
      id: response.id,
      init_point: response.init_point, // URL para redirecionar (produção)
      sandbox_init_point: response.sandbox_init_point, // URL para redirecionar (teste)
    })
  } catch (error: any) {
    console.error('Erro ao criar preferência Mercado Pago:', error)
    return NextResponse.json(
      {
        error: 'Erro ao criar preferência de pagamento',
        details: error.message
      },
      { status: 500 }
    )
  }
}
