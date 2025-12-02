'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiClock, FiCheckCircle, FiPackage, FiXCircle } from 'react-icons/fi'

interface UpdateOrderStatusButtonProps {
  orderId: number
  currentStatus: string
}

const statusOptions = [
  { value: 'pending', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: FiClock },
  { value: 'paid', label: 'Pago', color: 'bg-green-100 text-green-800', icon: FiCheckCircle },
  { value: 'shipped', label: 'Enviado', color: 'bg-blue-100 text-blue-800', icon: FiPackage },
  { value: 'delivered', label: 'Entregue', color: 'bg-green-100 text-green-800', icon: FiCheckCircle },
  { value: 'cancelled', label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: FiXCircle },
]

export function UpdateOrderStatusButton({ orderId, currentStatus }: UpdateOrderStatusButtonProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return

    setIsUpdating(true)

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar status')
      }

      router.refresh()
    } catch (error) {
      alert('Erro ao atualizar status do pedido')
    } finally {
      setIsUpdating(false)
    }
  }

  const currentOption = statusOptions.find(opt => opt.value === currentStatus) || statusOptions[0]
  const StatusIcon = currentOption.icon

  return (
    <div className="relative group">
      <button
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${currentOption.color} cursor-pointer`}
        disabled={isUpdating}
      >
        <StatusIcon size={14} />
        {isUpdating ? 'Atualizando...' : currentOption.label}
      </button>

      {/* Dropdown */}
      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-[150px]">
        {statusOptions.map((option) => {
          const Icon = option.icon
          return (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              disabled={isUpdating}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                option.value === currentStatus ? 'bg-gray-50 font-medium' : ''
              }`}
            >
              <Icon size={14} />
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
