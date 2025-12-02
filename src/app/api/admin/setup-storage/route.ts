import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Lista todos os buckets existentes
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error('Error listing buckets:', listError)
      return NextResponse.json({
        success: false,
        error: 'Erro ao listar buckets',
        details: listError.message,
      }, { status: 500 })
    }

    // Verifica se o bucket 'products' já existe
    const productsBucketExists = buckets?.some(bucket => bucket.name === 'products')

    if (productsBucketExists) {
      return NextResponse.json({
        success: true,
        message: 'Bucket "products" já existe',
        buckets: buckets?.map(b => b.name),
      })
    }

    // Tenta criar o bucket 'products'
    const { data: newBucket, error: createError } = await supabase.storage.createBucket('products', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'],
    })

    if (createError) {
      console.error('Error creating bucket:', createError)
      return NextResponse.json({
        success: false,
        error: 'Erro ao criar bucket',
        details: createError.message,
        hint: 'Você precisa criar o bucket manualmente no painel do Supabase',
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Bucket "products" criado com sucesso!',
      bucket: newBucket,
    })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro inesperado',
      details: error.message,
    }, { status: 500 })
  }
}
