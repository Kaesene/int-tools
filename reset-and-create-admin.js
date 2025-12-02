// Script para deletar e recriar admin
// Execute: node reset-and-create-admin.js

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function resetAndCreateAdmin() {
  const email = 'thiagobernardineli@icloud.com'
  const password = 'Thiagoeloko!22'
  const name = 'Thiago Admin'

  console.log('🔄 Deletando usuário existente...')

  try {
    // 1. Deletar da tabela users
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('email', email)

    if (deleteError) {
      console.log('⚠️  Aviso ao deletar da tabela users:', deleteError.message)
    } else {
      console.log('✅ Deletado da tabela users')
    }

    // Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('🔄 Criando novo usuário admin...')

    // 2. Criar novo usuário no Auth
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

      // Se o erro for que já existe, tenta fazer login para pegar o ID
      if (authError.message.includes('already registered')) {
        console.log('🔄 Usuário já existe no Auth, tentando fazer login...')

        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (loginError) {
          console.error('❌ Senha incorreta ou erro:', loginError.message)
          console.log('💡 Você precisa resetar a senha no Supabase manualmente')
          return
        }

        if (loginData.user) {
          console.log('✅ Login bem-sucedido! ID:', loginData.user.id)

          // Criar/Atualizar na tabela users
          const now = new Date().toISOString()
          const { error: upsertError } = await supabase
            .from('users')
            .upsert({
              id: loginData.user.id,
              email,
              name,
              is_admin: true,
              created_at: now,
              updated_at: now,
            })

          if (upsertError) {
            console.error('❌ Erro ao criar na tabela users:', upsertError.message)
          } else {
            console.log('✅ Admin criado/atualizado com sucesso!')
          }
        }
        return
      }
      return
    }

    if (!authData.user) {
      console.error('❌ Usuário não foi criado')
      return
    }

    console.log('✅ Usuário criado no Auth:', authData.user.id)

    // 3. Criar na tabela users com is_admin = true
    const now = new Date().toISOString()
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        is_admin: true,
        created_at: now,
        updated_at: now,
      })

    if (userError) {
      console.error('❌ Erro ao criar na tabela users:', userError.message)
      return
    }

    console.log('✅ Admin criado com sucesso!')
    console.log('')
    console.log('📧 Email:', email)
    console.log('🔑 Senha:', password)
    console.log('👑 Admin: SIM')
    console.log('')
    console.log('🚀 Acesse: https://int-tools.vercel.app/admin/login')
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

resetAndCreateAdmin()
