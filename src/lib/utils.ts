import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(price: number | string) {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numPrice)
}

export function formatDate(date: Date | string) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj)
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

export function truncate(text: string, length: number = 100) {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// ============================================
// Validação e Formatação de CPF
// ============================================

export function isValidCPF(cpf: string): boolean {
  if (!cpf) return false

  // Remove caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, '')

  // Verifica se tem 11 dígitos
  if (cleaned.length !== 11) return false

  // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cleaned)) return false

  // Validação dos dígitos verificadores
  let sum = 0
  let remainder

  // Valida primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false

  // Valida segundo dígito verificador
  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.substring(10, 11))) return false

  return true
}

export function formatCPF(cpf: string): string {
  if (!cpf) return ''

  // Remove caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, '')

  // Aplica máscara: XXX.XXX.XXX-XX
  if (cleaned.length <= 3) return cleaned
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`
  if (cleaned.length <= 9)
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`

  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`
}

// ============================================
// Validação e Formatação de Telefone
// ============================================

export function isValidPhone(phone: string): boolean {
  if (!phone) return false

  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '')

  // Telefone brasileiro tem 11 dígitos (DDD + 9 dígitos)
  // Ex: (11) 98765-4321 = 11987654321
  return cleaned.length === 11
}

export function formatPhone(phone: string): string {
  if (!phone) return ''

  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '')

  // Aplica máscara: (XX) XXXXX-XXXX
  if (cleaned.length <= 2) return `(${cleaned}`
  if (cleaned.length <= 7)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`

  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
}
