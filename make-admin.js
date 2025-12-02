// Script para tornar usuário existente em admin
// Execute: node make-admin.js

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function makeAdmin() {
  const email = 'thiagobernardineli@icloud.com'

  console.log('🔄 Buscando usuário...')

  try {
    // 1. Buscar usuário pelo email
    const { data: users, error: searchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)

    if (searchError) {
      console.error('❌ Erro ao buscar:', searchError.message)
      return
    }

    if (!users || users.length === 0) {
      console.error('❌ Usuário não encontrado na tabela users')
      console.log('💡 Tente fazer login na loja primeiro para criar o registro')
      return
    }

    const user = users[0]
    console.log('✅ Usuário encontrado:', user.id)

    // 2. Atualizar para admin
    const { error: updateError } = await supabase
      .from('users')
      .update({ is_admin: true })
      .eq('id', user.id)

    if (updateError) {
      console.error('❌ Erro ao atualizar:', updateError.message)
      return
    }

    console.log('✅ Usuário promovido a ADMIN com sucesso!')
    console.log('')
    console.log('📧 Email:', email)
    console.log('👑 Admin:', 'SIM')
    console.log('')
    console.log('🚀 Acesse: https://int-tools.vercel.app/admin/login')
    console.log('💡 Use a MESMA senha que você criou antes')
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

makeAdmin()
