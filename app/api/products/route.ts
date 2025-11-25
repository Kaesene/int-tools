import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
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

    // Validações
    if (!name || !slug || !sku || !categoryId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Verifica se SKU já existe
    const existingSku = await prisma.product.findUnique({
      where: { sku },
    });

    if (existingSku) {
      return NextResponse.json(
        { error: 'SKU já está em uso' },
        { status: 400 }
      );
    }

    // Verifica se slug já existe
    const existingSlug = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: 'Slug já está em uso' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
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
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    );
  }
}
