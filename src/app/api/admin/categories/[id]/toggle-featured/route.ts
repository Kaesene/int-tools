import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = parseInt(params.id)

    // Buscar a categoria atual
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      )
    }

    const newFeaturedStatus = !category.isFeatured

    // Se estamos tentando MARCAR como destaque, verificar limite
    if (newFeaturedStatus) {
      const featuredCount = await prisma.category.count({
        where: { isFeatured: true },
      })

      if (featuredCount >= 5) {
        return NextResponse.json(
          { error: 'Limite de 5 categorias em destaque atingido. Remova outra categoria de destaque primeiro.' },
          { status: 400 }
        )
      }
    }

    // Fazer o toggle
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { isFeatured: newFeaturedStatus },
    })

    return NextResponse.json({
      success: true,
      isFeatured: updatedCategory.isFeatured
    })
  } catch (error) {
    console.error('Error toggling featured status:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar status de destaque' },
      { status: 500 }
    )
  }
}
