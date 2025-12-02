// Script para criar usuário admin
// Execute: node create-admin.js

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function createAdmin() {
  const email = 'thiagobernardineli@icloud.com'
  const password = 'Thiagoeloko!22'
  const name = 'Thiago Admin'

  console.log('🔄 Criando usuário admin...')

  try {
    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: undefined,
      },
    })

    if (authError) {
      console.error('❌ Erro ao criar no Auth:', authError.message)
      return
    }

    if (!authData.user) {
      console.error('❌ Usuário não foi criado')
      return
    }

    console.log('✅ Usuário criado no Auth:', authData.user.id)

    // 2. Criar/Atualizar na tabela users com is_admin = true
    const now = new Date().toISOString()
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert({
        id: authData.user.id,
        email,
        name,
        is_admin: true,
        created_at: now,
        updated_at: now,
      })
      .select()

    if (userError) {
      console.error('❌ Erro ao criar na tabela users:', userError.message)

      // Tentar update se já existe
      const { error: updateError } = await supabase
        .from('users')
        .update({ is_admin: true })
        .eq('id', authData.user.id)

      if (updateError) {
        console.error('❌ Erro ao atualizar:', updateError.message)
      } else {
        console.log('✅ Admin atualizado com sucesso!')
      }
      return
    }

    console.log('✅ Admin criado com sucesso!')
    console.log('')
    console.log('📧 Email:', email)
    console.log('🔑 Senha:', password)
    console.log('')
    console.log('🚀 Acesse: https://int-tools.vercel.app/admin/login')
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

createAdmin()
