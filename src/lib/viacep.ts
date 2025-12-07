export interface ViaCEPAddress {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

export async function buscarCEP(cep: string): Promise<ViaCEPAddress | null> {
  try {
    // Remove formatacao do CEP
    const cleanCEP = cep.replace(/\D/g, '')

    // Valida tamanho
    if (cleanCEP.length !== 8) {
      return null
    }

    console.log('🔍 Buscando CEP:', cleanCEP)

    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    // ViaCEP retorna {erro: true} se CEP nao existe
    if (data.erro) {
      return null
    }

    console.log('✅ CEP encontrado:', data)

    return data
  } catch (error) {
    console.error('❌ Erro ao buscar CEP:', error)
    return null
  }
}

export function formatCEP(cep: string): string {
  const cleanCEP = cep.replace(/\D/g, '')
  if (cleanCEP.length !== 8) return cep
  return `${cleanCEP.slice(0, 5)}-${cleanCEP.slice(5)}`
}
