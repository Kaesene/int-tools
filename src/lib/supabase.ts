import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper para verificar se está autenticado
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Helper para fazer logout
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Helper para upload de imagens
export async function uploadImage(file: File, bucket: string = 'products') {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) {
    throw error
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return publicUrl
}

// Helper para deletar imagem
export async function deleteImage(url: string, bucket: string = 'products') {
  const path = url.split(`${bucket}/`)[1]
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  return { error }
}
