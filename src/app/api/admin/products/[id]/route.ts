import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar produto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        category: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar produto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()

    const product = await prisma.product.update({
      where: { id: parseInt(params.id) },
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
        // Campos de frete
        shippingWeight: data.shippingWeight || null,
        shippingWidth: data.shippingWidth || null,
        shippingHeight: data.shippingHeight || null,
        shippingLength: data.shippingLength || null,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar produto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: parseInt(params.id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
