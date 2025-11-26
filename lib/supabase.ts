import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Upload de imagem para o Supabase Storage
export async function uploadImage(file: File, folder: string = 'products'): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Erro ao fazer upload:', error);
    throw new Error('Falha ao fazer upload da imagem');
  }

  // Retorna a URL pública da imagem
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

// Deletar imagem do Supabase Storage
export async function deleteImage(imageUrl: string): Promise<void> {
  // Extrai o caminho da imagem da URL
  const urlParts = imageUrl.split('/product-images/');
  if (urlParts.length < 2) return;

  const filePath = urlParts[1];

  const { error } = await supabase.storage
    .from('product-images')
    .remove([filePath]);

  if (error) {
    console.error('Erro ao deletar imagem:', error);
    throw new Error('Falha ao deletar imagem');
  }
}
