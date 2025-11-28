import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { name, street, number, complement, neighborhood, city, state, zipCode, isDefault } = await request.json();

    // Validações
    if (!name || !street || !number || !neighborhood || !city || !state || !zipCode) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      );
    }

    // Se isDefault for true, primeiro remove o default dos outros endereços
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Cria o endereço
    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        name,
        street,
        number,
        complement: complement || null,
        neighborhood,
        city,
        state,
        zipCode,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json({
      message: 'Endereço adicionado com sucesso!',
      address,
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao adicionar endereço:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar endereço' },
      { status: 500 }
    );
  }
}
