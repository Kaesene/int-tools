# INT TOOLS - Loja Virtual de Ferramentas

Loja virtual completa desenvolvida com Next.js 14, TypeScript, Tailwind CSS e Supabase.

## Stack Tecnológica

- **Frontend:** Next.js 14 + React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Auth:** Supabase Auth
- **Payment:** Mercado Pago
- **Shipping:** API Correios
- **Storage:** Supabase Storage
- **State:** Zustand
- **Forms:** React Hook Form + Zod

## Estrutura do Projeto

```
int-tools/
├── src/
│   ├── app/              # Rotas Next.js (App Router)
│   ├── components/       # Componentes React
│   │   ├── layout/      # Header, Footer, Navbar
│   │   ├── product/     # Componentes de produto
│   │   ├── cart/        # Carrinho
│   │   ├── checkout/    # Finalização
│   │   ├── admin/       # Painel admin
│   │   └── ui/          # Componentes base
│   ├── lib/             # Utilitários
│   ├── contexts/        # React Context
│   ├── hooks/           # Custom hooks
│   └── types/           # TypeScript types
├── prisma/
│   ├── schema.prisma    # Schema do banco
│   └── seed.ts          # Dados iniciais
└── public/              # Assets estáticos
```

## Setup do Projeto

### 1. Clonar/Baixar o Projeto

```bash
cd C:\Users\Thiago\Documents\int-tools
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Supabase

Siga o guia completo: **[SETUP-SUPABASE.md](./SETUP-SUPABASE.md)**

Resumo:
1. Criar projeto no Supabase
2. Obter credenciais (URL, API Key, Database URL)
3. Preencher `.env.local`
4. Executar migrations

### 4. Configurar Banco de Dados

```bash
# Gerar cliente Prisma
npm run db:generate

# Criar tabelas
npm run db:push

# Inserir dados iniciais (categorias)
npm run db:seed
```

### 5. Executar o Projeto

```bash
npm run dev
```

Abra: http://localhost:3000

## Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Servidor de produção
npm run lint         # Verificar código

npm run db:generate  # Gerar cliente Prisma
npm run db:push      # Aplicar schema no banco
npm run db:migrate   # Criar migration
npm run db:seed      # Inserir dados iniciais
npm run db:studio    # Abrir Prisma Studio
```

## Funcionalidades

### MVP (Fase 1)
- [x] Setup do projeto
- [x] Banco de dados configurado
- [ ] Catálogo de produtos
- [ ] Carrinho de compras
- [ ] Checkout
- [ ] Pagamento (Mercado Pago)
- [ ] Área do cliente
- [ ] Painel administrativo

### Fase 2 (Melhorias)
- [ ] Filtros avançados
- [ ] Avaliações de produtos
- [ ] Lista de desejos
- [ ] Emails transacionais
- [ ] Estatísticas admin

### Fase 3 (Avançado)
- [ ] SEO otimizado
- [ ] Sistema de cupons
- [ ] PWA
- [ ] Analytics

## Variáveis de Ambiente

Copie `.env.example` para `.env.local` e preencha:

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN="APP_USR-..."
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY="APP_USR-..."

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="INT Tools"
```

## Banco de Dados

### Tabelas Principais

- **categories** - Categorias de produtos
- **products** - Produtos (nome, preço, estoque, imagens)
- **users** - Usuários e admins
- **addresses** - Endereços de entrega
- **cart_items** - Itens no carrinho
- **orders** - Pedidos
- **order_items** - Itens do pedido
- **reviews** - Avaliações
- **favorites** - Lista de desejos

### Visualizar Banco

```bash
npm run db:studio
```

Abre Prisma Studio em http://localhost:5555

## Deploy

### Vercel (Recomendado)

1. Push do código para GitHub
2. Importar projeto no Vercel
3. Configurar variáveis de ambiente
4. Deploy automático

### Importante no Deploy
- Usar credenciais de **PRODUÇÃO** do Mercado Pago
- Configurar webhook: `https://seu-site.vercel.app/api/payment/webhook`
- Habilitar HTTPS (automático no Vercel)

## Desenvolvimento

### Criar Nova Migration

```bash
npm run db:migrate
# Digite o nome da migration quando solicitado
```

### Adicionar Nova Categoria

```bash
npm run db:studio
# Abra a tabela categories
# Clique em "Add record"
```

### Testar Pagamento

Use as credenciais de TESTE do Mercado Pago:
- Cartão de teste: 5031 4332 1540 6351
- CVV: 123
- Data: 11/25

## Troubleshooting

### Erro de conexão com banco
```bash
# Verificar se DATABASE_URL está correta
# Verificar se Supabase está online
# Tentar: npm run db:push
```

### Prisma Client desatualizado
```bash
npm run db:generate
```

### Limpar banco e recomeçar
```bash
npx prisma migrate reset
npm run db:push
npm run db:seed
```

## Licença

Projeto privado - INT TOOLS

## Suporte

Dúvidas? Entre em contato com o desenvolvedor.
