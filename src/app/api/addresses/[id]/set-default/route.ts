import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // Buscar o endereço
    const address = await prisma.address.findUnique({ where: { id } })

    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // Desmarcar todos os endereços padrão do usuário
    await prisma.address.updateMany({
      where: {
        userId: address.userId,
        isDefault: true,
      },
      data: { isDefault: false },
    })

    // Marcar este como padrão
    const updated = await prisma.address.update({
      where: { id },
      data: { isDefault: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error setting default address:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
