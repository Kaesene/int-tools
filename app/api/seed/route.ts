import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Criar categoria
    const category = await prisma.category.upsert({
      where: { slug: 'ferramentas-eletricas' },
      update: {},
      create: {
        name: 'Ferramentas Elétricas',
        slug: 'ferramentas-eletricas',
        description: 'Ferramentas elétricas profissionais',
      },
    });

    // Criar produtos
    const products = await Promise.all([
      prisma.product.upsert({
        where: { slug: 'parafusadeira-20v' },
        update: {},
        create: {
          name: 'Parafusadeira Elétrica 20V',
          slug: 'parafusadeira-20v',
          description: 'Parafusadeira profissional de 20V com bateria de lítio. Ideal para uso intenso.',
          shortDescription: 'Parafusadeira potente de 20V',
          price: 399.90,
          comparePrice: 599.90,
          images: ['https://placehold.co/600x600/000000/FFFFFF/png?text=Parafusadeira'],
          sku: 'PAR-20V-001',
          stock: 15,
          categoryId: category.id,
        },
      }),
      prisma.product.upsert({
        where: { slug: 'furadeira-impacto' },
        update: {},
        create: {
          name: 'Furadeira de Impacto 800W',
          slug: 'furadeira-impacto',
          description: 'Furadeira de impacto potente com 800W. Perfeita para concreto e alvenaria.',
          shortDescription: 'Furadeira de impacto 800W',
          price: 299.90,
          images: ['https://placehold.co/600x600/000000/FFFFFF/png?text=Furadeira'],
          sku: 'FUR-800W-001',
          stock: 8,
          categoryId: category.id,
        },
      }),
      prisma.product.upsert({
        where: { slug: 'kit-ferramentas' },
        update: {},
        create: {
          name: 'Kit Ferramentas 100 Peças',
          slug: 'kit-ferramentas',
          description: 'Kit completo com 100 peças incluindo chaves, alicates, martelo e muito mais.',
          shortDescription: 'Kit completo com 100 peças',
          price: 189.90,
          comparePrice: 299.90,
          images: ['https://placehold.co/600x600/000000/FFFFFF/png?text=Kit+100pc'],
          sku: 'KIT-100-001',
          stock: 20,
          categoryId: category.id,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Produtos de teste criados com sucesso!',
      data: {
        category,
        products,
      },
    });
  } catch (error) {
    console.error('Erro ao criar produtos:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar produtos de teste' },
      { status: 500 }
    );
  }
}
