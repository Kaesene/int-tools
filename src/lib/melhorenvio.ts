const MELHOR_ENVIO_API = 'https://melhorenvio.com.br/api/v2/me'

interface MelhorEnvioHeaders {
  Accept: string
  'Content-Type': string
  Authorization: string
  'User-Agent': string
}

function getHeaders(): MelhorEnvioHeaders {
  const token = process.env.MELHOR_ENVIO_TOKEN
  if (!token) {
    throw new Error('MELHOR_ENVIO_TOKEN nao configurado')
  }

  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'User-Agent': 'INT-TOOLS (contato@inttools.com.br)',
  }
}

export interface CreateShipmentData {
  service: number // 1=PAC, 2=SEDEX, 17=Loggi
  from: {
    name: string
    phone: string
    email: string
    document: string
    address: string
    complement?: string
    number: string
    district: string
    city: string
    state_abbr: string
    postal_code: string
  }
  to: {
    name: string
    phone: string
    email: string
    document: string
    address: string
    complement?: string
    number: string
    district: string
    city: string
    state_abbr: string
    postal_code: string
  }
  package: {
    weight: number
    width: number
    height: number
    length: number
  }
  options: {
    insurance_value: number
    receipt: boolean
    own_hand: boolean
    collect: boolean
    reverse: boolean
    non_commercial: boolean
    invoice?: {
      key: string
    }
  }
}

// 1. Adicionar envio ao carrinho
export async function addToCart(data: CreateShipmentData) {
  try {
    console.log('📦 Adicionando envio ao carrinho ME:', data)

    const response = await fetch(`${MELHOR_ENVIO_API}/cart`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Erro ME addToCart:', error)
      throw new Error(JSON.stringify(error))
    }

    const result = await response.json()
    console.log('✅ Envio adicionado ao carrinho:', result.id)

    return result
  } catch (error: any) {
    console.error('❌ Erro ao adicionar ao carrinho ME:', error)
    throw error
  }
}

// 2. Fazer checkout (comprar envios do carrinho)
export async function checkout(orderIds: string[]) {
  try {
    console.log('💳 Fazendo checkout no ME:', orderIds)

    const response = await fetch(`${MELHOR_ENVIO_API}/shipment/checkout`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ orders: orderIds }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Erro ME checkout:', error)
      throw new Error(JSON.stringify(error))
    }

    const result = await response.json()
    console.log('✅ Checkout realizado:', result)

    return result
  } catch (error: any) {
    console.error('❌ Erro ao fazer checkout ME:', error)
    throw error
  }
}

// 3. Gerar etiquetas
export async function generateLabels(orderIds: string[]) {
  try {
    console.log('🏷️ Gerando etiquetas no ME:', orderIds)

    const response = await fetch(`${MELHOR_ENVIO_API}/shipment/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ orders: orderIds }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Erro ME generateLabels:', error)
      throw new Error(JSON.stringify(error))
    }

    const result = await response.json()
    console.log('✅ Etiquetas geradas:', result)

    return result
  } catch (error: any) {
    console.error('❌ Erro ao gerar etiquetas ME:', error)
    throw error
  }
}

// 4. Imprimir etiquetas (retorna URL do PDF)
export async function printLabels(orderIds: string[]) {
  try {
    console.log('🖨️ Imprimindo etiquetas no ME:', orderIds)

    const response = await fetch(`${MELHOR_ENVIO_API}/shipment/print`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ orders: orderIds }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Erro ME printLabels:', error)
      throw new Error(JSON.stringify(error))
    }

    const result = await response.json()
    console.log('✅ URL da etiqueta:', result.url)

    return result.url
  } catch (error: any) {
    console.error('❌ Erro ao imprimir etiquetas ME:', error)
    throw error
  }
}

// 5. Buscar informacoes de um envio (incluindo rastreio)
export async function getShipment(orderId: string) {
  try {
    console.log('🔍 Buscando informacoes do envio ME:', orderId)

    const response = await fetch(`${MELHOR_ENVIO_API}/orders/${orderId}`, {
      method: 'GET',
      headers: getHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Erro ME getShipment:', error)
      throw new Error(JSON.stringify(error))
    }

    const result = await response.json()
    console.log('✅ Informacoes do envio:', {
      id: result.id,
      status: result.status,
      tracking: result.tracking,
    })

    return result
  } catch (error: any) {
    console.error('❌ Erro ao buscar envio ME:', error)
    throw error
  }
}

// 6. Rastrear envio
export async function trackShipment(trackingCode: string) {
  try {
    console.log('📍 Rastreando envio ME:', trackingCode)

    const response = await fetch(`${MELHOR_ENVIO_API}/shipment/tracking`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ orders: [trackingCode] }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Erro ME trackShipment:', error)
      throw new Error(JSON.stringify(error))
    }

    const result = await response.json()
    console.log('✅ Rastreamento:', result)

    return result
  } catch (error: any) {
    console.error('❌ Erro ao rastrear envio ME:', error)
    throw error
  }
}

// 7. Cancelar envio
export async function cancelShipment(orderId: string) {
  try {
    console.log('❌ Cancelando envio ME:', orderId)

    const response = await fetch(`${MELHOR_ENVIO_API}/shipment/cancel`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ order: { id: orderId } }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Erro ME cancelShipment:', error)
      throw new Error(JSON.stringify(error))
    }

    const result = await response.json()
    console.log('✅ Envio cancelado:', result)

    return result
  } catch (error: any) {
    console.error('❌ Erro ao cancelar envio ME:', error)
    throw error
  }
}

// Helper: Converter nome do servico para ID
export function getServiceId(serviceName: string): number {
  const serviceMap: { [key: string]: number } = {
    PAC: 1,
    SEDEX: 2,
    'Loggi Express': 17,
    Loggi: 17,
  }

  return serviceMap[serviceName] || 1 // Default PAC
}
