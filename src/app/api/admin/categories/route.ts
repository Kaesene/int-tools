import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Se está tentando criar como destaque, verificar limite
    if (data.isFeatured) {
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

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        isFeatured: data.isFeatured || false,
        displayOrder: data.displayOrder || 0,
        active: data.active ?? true,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
