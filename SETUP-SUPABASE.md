# Guia de Setup - Supabase para INT TOOLS

## Passo 1: Criar Projeto no Supabase (2 minutos)

1. Acesse: **https://supabase.com**
2. Faça login ou crie uma conta
3. Clique em **"New Project"**
4. Preencha:
   - **Name:** INT Tools
   - **Database Password:** (crie uma senha forte e ANOTE!)
   - **Region:** South America (São Paulo) - mais próximo do Brasil
   - **Pricing Plan:** Free (suficiente para começar)
5. Clique em **"Create new project"**
6. Aguarde 2-3 minutos (o Supabase está criando seu banco de dados)

---

## Passo 2: Obter Credenciais (1 minuto)

Quando o projeto estiver pronto:

1. Vá em **Settings** (ícone de engrenagem) → **API**
2. Copie as informações:

### Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```

### Project API Keys → anon public
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Vá em **Settings** → **Database** → **Connection string** → **URI**
4. Copie a connection string:
```
postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

**IMPORTANTE:** Substitua `[YOUR-PASSWORD]` pela senha que você criou no Passo 1!

---

## Passo 3: Configurar Variáveis de Ambiente (1 minuto)

Abra o arquivo `.env.local` na raiz do projeto e preencha:

```env
# DATABASE (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.xxxxxxxxxxxxx:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxxxxxxxxxx:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"

# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# MERCADO PAGO (deixe em branco por enquanto)
MERCADOPAGO_ACCESS_TOKEN=
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=

# SITE
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="INT Tools"

# STORAGE (preencher depois de criar bucket)
NEXT_PUBLIC_SUPABASE_STORAGE_URL=
```

**Dicas:**
- DATABASE_URL usa porta **6543** (pgbouncer)
- DIRECT_URL usa porta **5432** (conexão direta)
- Substitua `[SUA-SENHA]` pela senha do banco

---

## Passo 4: Executar Migrations (30 segundos)

Abra o terminal na pasta do projeto e execute:

```bash
cd C:\Users\Thiago\Documents\int-tools

# Gerar cliente Prisma
npm run db:generate

# Criar tabelas no banco
npm run db:push

# Inserir categorias iniciais
npm run db:seed
```

Você verá mensagens de sucesso como:
```
✅ Categorias criadas com sucesso!
📦 Total de categorias: 6
```

---

## Passo 5: Criar Storage Bucket (1 minuto)

1. No Supabase, vá em **Storage** (menu lateral)
2. Clique em **"Create a new bucket"**
3. Preencha:
   - **Name:** `products`
   - **Public bucket:** ✅ SIM (marque esta opção!)
4. Clique em **"Create bucket"**

5. Após criar, copie a URL do bucket:
```
https://xxxxxxxxxxxxx.supabase.co/storage/v1/object/public/products/
```

6. Cole no `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://xxxxxxxxxxxxx.supabase.co/storage/v1/object/public/products/
```

---

## Passo 6: Verificar Setup (1 minuto)

Execute o Prisma Studio para ver o banco de dados:

```bash
npm run db:studio
```

Abrirá uma aba no navegador em `http://localhost:5555`

Verifique:
- ✅ Tabela `categories` existe
- ✅ Possui 6 categorias (Ferramentas Manuais, Elétricas, etc)
- ✅ Outras tabelas estão criadas (products, users, orders, etc)

---

## Passo 7: Testar o Projeto

Execute o projeto:

```bash
npm run dev
```

Abra: http://localhost:3000

Se aparecer a página do Next.js, está tudo funcionando! 🎉

---

## Solução de Problemas

### Erro: "Can't reach database server"
- Verifique se a senha está correta no `.env.local`
- Verifique se copiou a connection string completa
- Aguarde 1-2 minutos (o Supabase pode estar inicializando)

### Erro: "Invalid API key"
- Verifique se copiou a `anon public` key corretamente
- Não copie a `service_role` key (essa é secreta!)

### Migrations não funcionam
```bash
# Limpar e tentar novamente
npx prisma migrate reset
npm run db:push
npm run db:seed
```

---

## Configurações Opcionais (Fase 2)

### Habilitar Autenticação
1. Vá em **Authentication** → **Providers**
2. Habilite **Email** (já vem ativo)
3. Configure templates de email se quiser customizar

### Row Level Security (RLS)
Após testar o projeto funcionando, vamos configurar RLS para segurança.

---

## Resumo dos Links Importantes

- **Dashboard Supabase:** https://supabase.com/dashboard
- **Documentação Prisma:** https://www.prisma.io/docs
- **Prisma Studio Local:** http://localhost:5555 (quando rodando)

---

## Próximos Passos

Após concluir este setup:
1. ✅ Banco de dados funcionando
2. ✅ Storage configurado
3. ✅ Variáveis de ambiente preenchidas
4. ⏭️ Próximo: Criar componentes base (Header, Footer)
5. ⏭️ Depois: Implementar autenticação
6. ⏭️ Depois: Criar catálogo de produtos

---

**Dúvidas?** Me avise em qual passo você está e posso te ajudar!
