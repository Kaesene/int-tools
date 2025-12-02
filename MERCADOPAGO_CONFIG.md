# Configuração do Mercado Pago (Modo TESTE)

## 📋 Pré-requisitos

1. Conta no Mercado Pago (gratuita)
2. Credenciais de TESTE configuradas

---

## 🔑 Como Obter as Credenciais de TESTE

### 1. Criar/Acessar Conta Mercado Pago Developers

1. Acesse: https://www.mercadopago.com.br/developers
2. Faça login ou crie uma conta (gratuito)
3. Aceite os termos de desenvolvedor

### 2. Obter Credenciais de TESTE

1. No painel do desenvolvedor, vá em: **"Suas integrações"**
2. Clique em **"Criar aplicação"** (se não tiver uma)
   - Nome: INT Tools (ou qualquer nome)
   - Tipo: Checkout API
   - Modelo de integração: Checkout Pro
3. Após criar, clique na aplicação
4. Vá na aba **"Credenciais de teste"**
5. Você verá:
   - **Public Key de teste** (começa com `TEST-...`)
   - **Access Token de teste** (começa com `TEST-...`)

### 3. Configurar no Projeto

Copie as credenciais e cole no arquivo `.env.local`:

```env
# MERCADO PAGO (TESTE)
MERCADOPAGO_ACCESS_TOKEN=TEST-seu-access-token-aqui
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-sua-public-key-aqui
```

**IMPORTANTE**: Use apenas credenciais de **TESTE** (começam com `TEST-`), nunca credenciais de produção durante desenvolvimento!

---

## 🧪 Como Testar Pagamentos

### Dados de Teste

O Mercado Pago fornece cartões de teste para simular aprovações e rejeições:

#### ✅ Cartão APROVADO
```
Número: 5031 4332 1540 6351
Nome: APRO (qualquer nome)
CVV: 123
Validade: 11/25 (qualquer data futura)
CPF: 12345678909
```

#### ❌ Cartão RECUSADO
```
Número: 5031 7557 3453 0604
Nome: OTHE (qualquer nome)
CVV: 123
Validade: 11/25
CPF: 12345678909
```

#### ⏳ Cartão PENDENTE
```
Número: 5031 4332 1540 6351
Nome: CALL (simula pagamento pendente)
CVV: 123
Validade: 11/25
CPF: 12345678909
```

Mais cartões de teste: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/test-cards

---

## 🔄 Fluxo de Pagamento

1. **Cliente finaliza checkout** → Cria pedido no banco
2. **Sistema cria preferência** → Mercado Pago gera link de pagamento
3. **Cliente é redirecionado** → Checkout seguro do Mercado Pago
4. **Cliente paga** → Usa cartão de teste
5. **Mercado Pago notifica webhook** → Sistema atualiza status do pedido
6. **Cliente retorna** → Página de sucesso/falha

---

## 📡 Configurar Webhook (Notificações)

Para receber notificações quando o pagamento for aprovado:

### Localmente (Desenvolvimento)

Use o **ngrok** para expor seu localhost:

```bash
# Instalar ngrok (uma vez)
npm install -g ngrok

# Expor porta 3000
ngrok http 3000
```

Você receberá uma URL pública, exemplo: `https://abc123.ngrok.io`

### Configurar URL no Mercado Pago

1. No painel do desenvolvedor
2. Vá em **"Suas integrações"** → Sua aplicação
3. Clique em **"Webhooks"** ou **"Notificações"**
4. Adicione a URL: `https://abc123.ngrok.io/api/mercadopago/webhook`
5. Selecione eventos:
   - ✅ `payment`
   - ✅ `merchant_order`

### Produção (Deploy Vercel/Heroku/etc)

Use a URL do seu domínio:
```
https://seusite.com.br/api/mercadopago/webhook
```

---

## ✅ Verificar Configuração

1. Reinicie o servidor Next.js após adicionar as credenciais
2. Acesse o checkout e tente finalizar um pedido
3. Você será redirecionado para o Mercado Pago
4. Use um cartão de teste para pagar
5. Após pagamento, volte ao site e veja o status atualizado

---

## 🐛 Resolução de Problemas

### Erro: "Mercado Pago não configurado"
- Verifique se o `.env.local` tem as credenciais
- Reinicie o servidor (`npm run dev`)

### Webhook não recebe notificações
- Verifique se o ngrok está rodando
- Verifique se configurou a URL correta no painel
- Veja os logs do webhook: http://localhost:3000/api/mercadopago/webhook

### Pagamento aprovado mas pedido continua pendente
- Verifique os logs do terminal (console do Next.js)
- Certifique-se que o webhook está configurado
- O Mercado Pago pode demorar alguns segundos para enviar a notificação

---

## 🚀 Mudar para Produção (Depois)

Quando estiver pronto para aceitar pagamentos reais:

1. Obtenha credenciais de **PRODUÇÃO** (sem `TEST-`)
2. Substitua no `.env.local` (ou `.env.production`)
3. Configure webhook com URL de produção
4. Faça um teste com valor real pequeno (R$ 0,50)
5. Esteja atento aos logs e monitore os primeiros pedidos

---

## 📚 Documentação Oficial

- Checkout Pro: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/landing
- Cartões de Teste: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/test-cards
- Webhooks: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
