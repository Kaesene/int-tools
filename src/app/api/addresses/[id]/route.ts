import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    await prisma.address.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()

    // Se isDefault = true, desmarcar outros endereços do mesmo usuário
    if (body.isDefault) {
      const address = await prisma.address.findUnique({ where: { id } })
      if (address) {
        await prisma.address.updateMany({
          where: {
            userId: address.userId,
            isDefault: true,
            id: { not: id },
          },
          data: { isDefault: false },
        })
      }
    }

    const updated = await prisma.address.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
