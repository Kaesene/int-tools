'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useClientAuth } from '@/contexts/ClientAuthContext'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { AddressForm } from '@/components/client/AddressForm'
import {
  FiMapPin,
  FiPlus,
  FiEdit,
  FiCreditCard,
  FiShoppingBag,
  FiAlertCircle,
  FiCheck,
  FiTruck,
} from 'react-icons/fi'
import Link from 'next/link'

interface Address {
  id: number
  name: string
  phone?: string
  cpf?: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

interface ShippingOption {
  id: string
  name: string
  price: number
  delivery_time: number
  company: {
    name: string
    picture: string
  }
}

export default function CheckoutPage() {
  const { user, isLoading: authLoading } = useClientAuth()
  const { items, totalPrice: total, clearCart } = useCart()
  const router = useRouter()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  // Shipping states
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null)
  const [isLoadingShipping, setIsLoadingShipping] = useState(false)

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/checkout')
    }
  }, [user, authLoading, router])

  // Carregar endereços do usuário
  useEffect(() => {
    if (user) {
      loadAddresses()
    }
  }, [user])

  const loadAddresses = async () => {
    if (!user) return

    try {
      setIsLoadingAddresses(true)
      const response = await fetch(`/api/addresses?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setAddresses(data)

        // Selecionar endereço padrão automaticamente
        const defaultAddress = data.find((addr: Address) => addr.isDefault)
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id)
        } else if (data.length > 0) {
          setSelectedAddressId(data[0].id)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar endereços:', error)
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  // Calcular frete quando endereço é selecionado
  useEffect(() => {
    if (selectedAddressId && addresses.length > 0) {
      const address = addresses.find((addr) => addr.id === selectedAddressId)
      if (address) {
        calculateShipping(address.zipCode)
      }
    }
  }, [selectedAddressId, addresses])

  const calculateShipping = async (zipCode: string) => {
    if (items.length === 0) return

    setIsLoadingShipping(true)
    setError('')

    try {
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zipCode,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price, // ✅ ADICIONADO: preço para cálculo do seguro
          })),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setShippingOptions(data.options || [])

        // Selecionar a primeira opção automaticamente (geralmente a mais barata)
        if (data.options && data.options.length > 0) {
          setSelectedShipping(data.options[0])
        }
      } else {
        console.error('Erro ao calcular frete')
        // Fallback: frete grátis em caso de erro
        const fallbackOption: ShippingOption = {
          id: 'free',
          name: 'Frete Gratis',
          price: 0,
          delivery_time: 7,
          company: { name: 'Frete Gratis', picture: '' },
        }
        setShippingOptions([fallbackOption])
        setSelectedShipping(fallbackOption)
      }
    } catch (error) {
      console.error('Erro ao calcular frete:', error)
      // Fallback: frete grátis em caso de erro
      const fallbackOption: ShippingOption = {
        id: 'free',
        name: 'Frete Gratis',
        price: 0,
        delivery_time: 7,
        company: { name: 'Frete Gratis', picture: '' },
      }
      setShippingOptions([fallbackOption])
      setSelectedShipping(fallbackOption)
    } finally {
      setIsLoadingShipping(false)
    }
  }

  const handleFinishOrder = async () => {
    if (!selectedAddressId) {
      setError('Por favor, selecione um endereço de entrega')
      return
    }

    if (!selectedShipping) {
      setError('Por favor, aguarde o calculo do frete')
      return
    }

    if (items.length === 0) {
      setError('Seu carrinho está vazio')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      // 1. Criar pedido no banco
      const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId)
      if (!selectedAddress) throw new Error('Endereço não encontrado')

      const shippingCost = selectedShipping.price
      const orderTotal = total + shippingCost

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          addressId: selectedAddressId,
          items: items.map((item) => ({
            productId: item.id,
            productName: item.name,
            productImage: item.thumbnail || '/placeholder.png',
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal: total,
          shippingCost: shippingCost,
          discount: 0,
          total: orderTotal,
          shippingName: selectedAddress.name,
          shippingPhone: selectedAddress.phone || user?.user_metadata?.phone || '',
          shippingCpf: selectedAddress.cpf || user?.user_metadata?.cpf || '',
          shippingStreet: selectedAddress.street,
          shippingNumber: selectedAddress.number,
          shippingComplement: selectedAddress.complement,
          shippingNeighborhood: selectedAddress.neighborhood,
          shippingCity: selectedAddress.city,
          shippingState: selectedAddress.state,
          shippingZipCode: selectedAddress.zipCode,
          shippingMethod: selectedShipping.name,
        }),
      })

      if (!orderResponse.ok) {
        throw new Error('Erro ao criar pedido')
      }

      const order = await orderResponse.json()

      // 2. Criar preferência de pagamento no Mercado Pago
      const preferenceResponse = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: order.orderNumber,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            thumbnail: item.thumbnail,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingCost,
          total: orderTotal,
          payer: {
            name: user?.user_metadata?.name || user?.email,
            email: user?.email,
          },
        }),
      })

      if (!preferenceResponse.ok) {
        const errorData = await preferenceResponse.json()
        throw new Error(errorData.error || 'Erro ao criar preferência de pagamento')
      }

      const preferenceData = await preferenceResponse.json()

      // Limpar carrinho
      clearCart()

      // 3. Redirecionar para checkout do Mercado Pago
      // Usar sandbox_init_point para teste ou init_point para produção
      const checkoutUrl = preferenceData.sandbox_init_point || preferenceData.init_point

      if (checkoutUrl) {
        window.location.href = checkoutUrl
      } else {
        throw new Error('URL de checkout não recebida')
      }
    } catch (error: any) {
      console.error('Erro ao finalizar pedido:', error)
      setError(error.message || 'Erro ao processar seu pedido. Tente novamente.')
      setIsProcessing(false)
    }
  }

  // Loading states
  if (authLoading || isLoadingAddresses) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    )
  }

  // Carrinho vazio
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <FiShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Seu carrinho está vazio</h1>
          <p className="text-gray-600 mb-6">
            Adicione produtos ao carrinho antes de finalizar a compra
          </p>
          <Link href="/produtos">
            <Button>Ver Produtos</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Address & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FiMapPin size={24} />
                Endereço de Entrega
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddressForm(true)}
                className="text-primary-600"
              >
                <FiPlus size={18} />
                Novo Endereço
              </Button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-8">
                <FiAlertCircle size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-600 mb-4">Você ainda não tem endereços cadastrados</p>
                <Button onClick={() => setShowAddressForm(true)}>
                  <FiPlus size={18} />
                  Adicionar Endereço
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedAddressId === address.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{address.name}</span>
                          {address.isDefault && (
                            <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded">
                              Padrão
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {address.street}, {address.number}
                          {address.complement && ` - ${address.complement}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.neighborhood} - {address.city}/{address.state}
                        </p>
                        <p className="text-sm text-gray-600">CEP: {address.zipCode}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Shipping Options */}
          {selectedAddressId && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiTruck size={24} />
                Forma de Entrega
              </h2>

              {isLoadingShipping ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  <span className="ml-3 text-gray-600">Calculando frete...</span>
                </div>
              ) : shippingOptions.length > 0 ? (
                <div className="space-y-3">
                  {shippingOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedShipping?.id === option.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={selectedShipping?.id === option.id}
                          onChange={() => setSelectedShipping(option)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-900">{option.name}</span>
                            <span className="text-lg font-bold text-primary-600">
                              {option.price === 0 ? 'GRATIS' : formatPrice(option.price)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {option.company.name} - Entrega em ate {option.delivery_time} dias uteis
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">
                  Selecione um endereco para calcular o frete
                </p>
              )}
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiCreditCard size={24} />
              Forma de Pagamento
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <FiAlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Integração com Mercado Pago</p>
                <p>Você será redirecionado para o Mercado Pago para concluir o pagamento com segurança.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo do Pedido</h2>

            {/* Items */}
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 pb-3 border-b">
                  <img
                    src={item.thumbnail || '/placeholder.png'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-xs text-gray-600">Qtd: {item.quantity}</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Frete:</span>
                {isLoadingShipping ? (
                  <span className="text-gray-400">Calculando...</span>
                ) : selectedShipping ? (
                  <span className={`font-medium ${selectedShipping.price === 0 ? 'text-green-600' : ''}`}>
                    {selectedShipping.price === 0 ? 'GRATIS' : formatPrice(selectedShipping.price)}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatPrice(total + (selectedShipping?.price || 0))}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            {/* Finish Button */}
            <Button
              onClick={handleFinishOrder}
              disabled={isProcessing || addresses.length === 0 || !selectedAddressId}
              isLoading={isProcessing}
              className="w-full mb-3"
            >
              <FiCheck size={20} />
              Finalizar Pedido
            </Button>

            <Link href="/carrinho">
              <Button variant="ghost" className="w-full text-sm">
                Voltar ao Carrinho
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      {showAddressForm && user && (
        <AddressForm
          userId={user.id}
          onClose={() => setShowAddressForm(false)}
          onSuccess={() => {
            loadAddresses()
            setShowAddressForm(false)
          }}
        />
      )}
    </div>
  )
}
