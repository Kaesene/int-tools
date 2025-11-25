import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar produto' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      slug,
      description,
      shortDescription,
      price,
      comparePrice,
      images,
      sku,
      stock,
      isActive,
      categoryId,
    } = body;

    // Verifica se SKU já está em uso por outro produto
    const existingSku = await prisma.product.findFirst({
      where: {
        sku,
        NOT: { id },
      },
    });

    if (existingSku) {
      return NextResponse.json({ error: 'SKU já está em uso' }, { status: 400 });
    }

    // Verifica se slug já está em uso por outro produto
    const existingSlug = await prisma.product.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });

    if (existingSlug) {
      return NextResponse.json({ error: 'Slug já está em uso' }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        shortDescription,
        price,
        comparePrice,
        images,
        sku,
        stock,
        isActive,
        categoryId,
      },
      include: { category: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return NextResponse.json({ error: 'Erro ao deletar produto' }, { status: 500 });
  }
}
