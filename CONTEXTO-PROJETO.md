# 📋 CONTEXTO COMPLETO DO PROJETO - INT Tools

> **IMPORTANTE:** Este arquivo é para você (Claude) entender todo o contexto do projeto quando o Thiago abrir uma nova conversa sem histórico.

---

## 👤 SOBRE O CLIENTE

**Nome:** Thiago Bernardineli
**Negócio:** Importador e vendedor de ferramentas e tecnologia para e-commerce
**Objetivo:** Criar uma loja virtual profissional e completa

---

## 🎯 SOBRE O PROJETO

### Nome da Empresa
**INT Tools** (International Tools)

**Origem do Nome:**
- Começamos com as iniciais "TB" (Thiago Bernardineli)
- Evoluímos para "INT" que significa:
  - **IN**ternational **T**ools
  - Ferramentas internacionais/importadas
  - Soa moderno e tech

### Identidade Visual Escolhida
**Estilo:** Mix Tech + Industrial

**Paleta de Cores:**
```css
Azul Tech (Primária):    #0066FF
Azul Escuro:             #0052CC
Laranja Industrial:      #FF6B35
Laranja Escuro:          #E55A2B
```

**Por quê?**
- Azul = Tecnologia, confiança, profissionalismo
- Laranja = Industrial, energia, ferramentas
- Combinação moderna e chamativa

---

## 🛒 TIPO DE PRODUTOS

A loja vende **4 categorias principais:**

1. **Ferramentas Manuais** 🔧
   - Chaves, alicates, martelos, etc.

2. **Ferramentas Elétricas** ⚡
   - Furadeiras, parafusadeiras, serras, etc.

3. **Gadgets Tech** 📱
   - Eletrônicos, acessórios tech, gadgets importados

4. **Equipamentos Profissionais** 🏗️
   - Equipamentos maiores, máquinas, ferramentas profissionais

---

## 📊 ESTRUTURA PLANEJADA (3 FASES)

### ✅ FASE 1 - MVP (CONCLUÍDA)

**O que foi feito:**
- ✅ Projeto Next.js 14 criado com TypeScript e Tailwind
- ✅ Identidade visual implementada (cores, tipografia)
- ✅ Header responsivo com:
  - Logo INT Tools
  - Menu de navegação
  - Ícones de busca, usuário, carrinho
  - Menu mobile (hamburger)
- ✅ Footer completo com:
  - Links rápidos
  - Suporte
  - Contato
  - Redes sociais
- ✅ Homepage com:
  - Hero Section impactante com gradiente
  - Categorias visuais (4 cards)
  - Grid de produtos em destaque (4 produtos mock)
  - Seção de benefícios
  - CTA final
- ✅ Componentes criados:
  - `Button` (4 variantes: primary, secondary, outline, ghost)
  - `ProductCard` (com avaliações, badges, preços)
  - `Header`
  - `Footer`
- ✅ Tipos TypeScript definidos em `/types/index.ts`:
  - Product, Category, CartItem, Cart, Review, User, Order, etc.
- ✅ Repositório GitHub criado: https://github.com/Kaesene/int-tools
- ✅ Design 100% responsivo

**Arquivos Principais:**
```
app/
  globals.css       → Variáveis CSS + estilos globais
  layout.tsx        → Layout com Header/Footer
  page.tsx          → Homepage completa
components/
  layout/Header.tsx
  layout/Footer.tsx
  product/ProductCard.tsx
  ui/Button.tsx
types/index.ts      → Todas as interfaces TypeScript
```

---

### 🔄 FASE 2 - FUNCIONALIDADES CORE (PRÓXIMO PASSO)

**O que precisa ser feito:**

#### 1. Banco de Dados
- [ ] Escolher banco: **Prisma + PostgreSQL** (Supabase ou Vercel Postgres)
- [ ] Criar schema do banco
- [ ] Configurar Prisma
- [ ] Criar migrations

#### 2. Painel Administrativo
- [ ] Criar rota `/admin`
- [ ] Sistema de autenticação (NextAuth.js)
- [ ] Dashboard administrativo
- [ ] CRUD de Produtos:
  - Listar produtos
  - Adicionar produto
  - Editar produto
  - Deletar produto
  - Upload de imagens
- [ ] Gerenciamento de categorias
- [ ] Gerenciamento de estoque
- [ ] Visualização de pedidos

#### 3. Sistema de Carrinho
- [ ] Context API ou Zustand para estado global do carrinho
- [ ] Adicionar produto ao carrinho
- [ ] Remover produto do carrinho
- [ ] Atualizar quantidade
- [ ] Calcular subtotal
- [ ] Página `/carrinho`

#### 4. Integração de Frete
- [ ] Integrar API dos Correios
- [ ] Calcular frete por CEP
- [ ] Mostrar opções de entrega (PAC, SEDEX)
- [ ] Calcular prazo de entrega

#### 5. Checkout e Pagamento
- [ ] Página `/checkout`
- [ ] Formulário de endereço
- [ ] Formulário de dados pessoais
- [ ] Integração **Mercado Pago**:
  - PIX
  - Cartão de crédito
  - Boleto
- [ ] Confirmação de pedido
- [ ] Envio de email confirmação

#### 6. Páginas Faltantes
- [ ] `/produtos` - Listagem completa com filtros
- [ ] `/produto/[slug]` - Página individual do produto
- [ ] `/categorias` - Página de categorias
- [ ] `/categoria/[slug]` - Produtos por categoria
- [ ] `/sobre` - Sobre a empresa
- [ ] `/contato` - Formulário de contato

---

### 📅 FASE 3 - EXTRAS E OTIMIZAÇÕES

**Funcionalidades Avançadas:**
- [ ] Sistema de avaliações de produtos
- [ ] Moderação de avaliações no admin
- [ ] Integração WhatsApp (botão flutuante)
- [ ] Sistema de busca avançada com filtros:
  - Por categoria
  - Por preço
  - Por marca
  - Por avaliação
- [ ] Newsletter/captação de leads
- [ ] SEO otimizado:
  - Meta tags dinâmicas
  - Open Graph
  - Schema.org (Product)
  - Sitemap.xml
- [ ] Analytics:
  - Google Analytics
  - Vercel Analytics
  - Facebook Pixel (opcional)
- [ ] Otimização de performance:
  - Lazy loading de imagens
  - Code splitting
  - Caching
- [ ] Wishlist (lista de desejos)
- [ ] Comparação de produtos
- [ ] Cupons de desconto
- [ ] Programa de fidelidade

---

## 🔧 STACK TÉCNICA ATUAL

```json
{
  "framework": "Next.js 16",
  "linguagem": "TypeScript",
  "estilização": "Tailwind CSS 4",
  "runtime": "Node.js",
  "deploy": "Vercel",
  "versionamento": "Git + GitHub"
}
```

**Decisões Futuras (Fase 2):**
- **Banco de Dados:** Prisma + PostgreSQL (Supabase)
- **Autenticação:** NextAuth.js
- **Pagamento:** Mercado Pago SDK
- **Frete:** API dos Correios (ViaCEP + Correios)
- **Estado Global:** Zustand ou Context API
- **Upload de Imagens:** Cloudinary ou Vercel Blob

---

## 📁 ESTRUTURA DE ARQUIVOS ATUAL

```
int-tools/
├── app/
│   ├── globals.css          # Estilos globais + variáveis CSS
│   ├── layout.tsx           # Layout raiz (Header + Footer)
│   ├── page.tsx             # Homepage
│   └── favicon.ico
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # Cabeçalho responsivo
│   │   └── Footer.tsx       # Rodapé completo
│   ├── product/
│   │   └── ProductCard.tsx  # Card de produto
│   ├── ui/
│   │   └── Button.tsx       # Botão reutilizável
│   └── cart/                # (vazio - criar na Fase 2)
│
├── types/
│   └── index.ts             # Interfaces TypeScript
│
├── lib/
│   ├── utils/               # (vazio - criar utilitários)
│   └── api/                 # (vazio - criar na Fase 2)
│
├── public/
│   ├── images/              # (vazio - adicionar imagens)
│   └── icons/               # (vazio - adicionar ícones)
│
├── CONTEXTO-PROJETO.md      # ESTE ARQUIVO
├── CHECKLIST-MIGRAÇÃO.md    # Guia para migrar entre PCs
├── README.md                # Documentação pública
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## 🎨 DESIGN SYSTEM

### Componentes UI Existentes

#### Button
**Localização:** `components/ui/Button.tsx`

**Variantes:**
- `primary` → Azul sólido
- `secondary` → Laranja sólido
- `outline` → Borda azul, fundo transparente
- `ghost` → Sem borda, hover com fundo cinza

**Tamanhos:**
- `sm` → Pequeno
- `md` → Médio (padrão)
- `lg` → Grande

**Props:**
```typescript
{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  children: React.ReactNode
}
```

#### ProductCard
**Localização:** `components/product/ProductCard.tsx`

**Features:**
- Imagem do produto
- Badge de desconto (%)
- Badge de estoque baixo
- Categoria
- Nome do produto
- Descrição curta
- Avaliação (estrelas)
- Preço com desconto
- Botão "Adicionar ao Carrinho"

**Props:**
```typescript
{
  product: Product
}
```

---

## 🚀 COMO COMEÇAR A FASE 2

### Quando o Thiago pedir para continuar:

**1. Primeiro, pergunte:**
```
Olá Thiago! Vi que o projeto INT Tools está na Fase 1 (MVP completo).
Pronto para começar a Fase 2?

Antes de começar, preciso saber:
1. Qual banco de dados prefere? (Supabase, Vercel Postgres, outro)
2. Já tem conta no Mercado Pago Developers?
3. Quer começar pelo Painel Admin ou Sistema de Carrinho?
```

**2. Se ele disser "continua", comece por:**
- Configurar Prisma + Banco de dados
- Criar models (Product, Category, User, Order)
- Criar página `/admin/produtos`
- Implementar CRUD básico

**3. Ordem sugerida de desenvolvimento:**
```
Fase 2.1: Banco + Admin
  → Configurar Prisma
  → Criar schema
  → Página admin/produtos (listar)
  → Adicionar produto
  → Editar produto
  → Deletar produto

Fase 2.2: Carrinho
  → Context API do carrinho
  → Adicionar ao carrinho
  → Página /carrinho
  → Calcular totais

Fase 2.3: Checkout
  → Página /checkout
  → Formulário de dados
  → Integração Mercado Pago
  → Confirmação de pedido
```

---

## 🌐 REPOSITÓRIO E DEPLOY

**GitHub:** https://github.com/Kaesene/int-tools
**Deploy:** Ainda não feito (fazer via Vercel)

**Para fazer deploy:**
1. Thiago deve acessar vercel.com
2. Conectar repositório `int-tools`
3. Deploy automático

---

## ⚠️ PONTOS IMPORTANTES

### O que NÃO fazer:
- ❌ Não mudar a identidade visual (cores, logo)
- ❌ Não usar outras cores além das definidas
- ❌ Não mudar a estrutura de pastas atual
- ❌ Não remover componentes existentes

### O que SEMPRE fazer:
- ✅ Manter o padrão de código TypeScript
- ✅ Usar os componentes existentes (Button, etc)
- ✅ Seguir a paleta de cores definida
- ✅ Manter responsividade em tudo
- ✅ Usar as interfaces TypeScript de `/types`
- ✅ Fazer commits descritivos
- ✅ Testar antes de commitar

---

## 📞 PREFERÊNCIAS DO THIAGO

- Gosta de desenvolvimento **faseado** (passo a passo)
- Prefere **Vercel** para deploy
- Stack: **JavaScript/TypeScript + React**
- Usa **Windows** (importante para comandos)
- Gosta de **nomes em inglês** para variáveis/funções
- Prefere **funcionalidades completas** a protótipos
- Quer integração com **Mercado Pago** (Brasil)
- Trabalha com **importação**, então produtos vêm de fora

---

## 🎯 OBJETIVO FINAL

Criar uma **loja virtual completa e profissional** onde:
- Thiago pode adicionar produtos via painel admin
- Clientes podem navegar, filtrar e comprar
- Pagamento via Mercado Pago (PIX, cartão, boleto)
- Cálculo automático de frete
- Sistema de pedidos e acompanhamento
- Design moderno e responsivo
- Performance otimizada

---

## 📝 NOTAS TÉCNICAS

### Produtos Mock Atuais (página inicial)
```typescript
1. Parafusadeira Elétrica 20V - R$ 399,90
2. Kit Chaves Precisão 32 Peças - R$ 89,90
3. Multímetro Digital - R$ 149,90
4. Pistola de Cola Quente - R$ 79,90
```

Esses são apenas exemplos visuais. Na Fase 2, virão do banco de dados.

### Variáveis CSS Importantes
```css
--primary: #0066FF
--secondary: #FF6B35
--gray-900: #1A1A1A
--success: #28A745
--warning: #FFC107
--error: #DC3545
```

Use sempre essas variáveis, não cores hardcoded.

---

## 🔄 STATUS ATUAL

✅ **Fase 1:** 100% Completa
🔄 **Fase 2:** 0% - Aguardando início
📅 **Fase 3:** Planejada

**Último commit:** "Adiciona checklist completo de migração entre PCs"
**Data:** 24/11/2025
**Branch:** master

---

## 🤝 COMO AJUDAR O THIAGO

Quando ele pedir ajuda:
1. **Leia este arquivo primeiro** para entender o contexto
2. Pergunte qual fase quer desenvolver
3. Seja específico e detalhado
4. Mostre código completo, não snippets
5. Explique decisões técnicas
6. Faça commits organizados
7. Mantenha a documentação atualizada

---

**Data de criação deste documento:** 24/11/2025
**Próxima revisão:** Após conclusão da Fase 2

---

**BOA SORTE, PRÓXIMO CLAUDE! 🚀**

Você tem tudo que precisa para continuar este projeto de onde parou.
