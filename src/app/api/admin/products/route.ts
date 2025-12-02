import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        shortDesc: data.shortDesc || null,
        price: data.price,
        oldPrice: data.oldPrice,
        stock: data.stock,
        categoryId: data.categoryId,
        brand: data.brand || null,
        model: data.model || null,
        voltage: data.voltage || null,
        power: data.power || null,
        warranty: data.warranty || null,
        active: data.active ?? true,
        featured: data.featured ?? false,
        images: data.images || [],
        thumbnail: data.thumbnail || null,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
