# Setup INT Tools - Configuração para Produção

## ✅ O QUE JÁ ESTÁ PRONTO

### Sistema Completo Implementado:
- ✅ E-commerce funcionando (produtos, carrinho, checkout)
- ✅ Autenticação de usuários (Supabase)
- ✅ Painel administrativo
- ✅ Integração Mercado Pago (modo teste)
- ✅ Cálculo de frete (Melhor Envio - PAC, SEDEX, Loggi)
- ✅ Sistema de código de rastreio
- ✅ **Emails automáticos** (4 tipos)
- ✅ **Páginas institucionais** (LGPD compliant)
- ✅ **Google Analytics** integrado
- ✅ **ViaCEP** para buscar endereços
- ✅ **SEO otimizado**

---

## 🚨 CONFIGURAÇÃO OBRIGATÓRIA NA VERCEL

Acesse: https://vercel.com/kaesene/int-tools/settings/environment-variables

### 1. Resend (Emails) - CRÍTICO
```
RESEND_API_KEY = re_xxxxxxxxxxxxxxxxx
EMAIL_FROM = noreply@inttools.com.br
```

**Como conseguir:**
1. Cadastre-se: https://resend.com/signup (GRATUITO até 3k emails/mês)
2. Verifique seu domínio (inttools.com.br)
3. Copie a API Key em: Dashboard → API Keys
4. Adicione na Vercel

**Emails enviados automaticamente:**
- Confirmação de pedido (ao criar)
- Pagamento aprovado (ao aprovar)
- Pedido enviado (ao adicionar rastreio)
- Pedido entregue (ao marcar como entregue)

---

### 2. Google Analytics - IMPORTANTE
```
NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX
```

**Como conseguir:**
1. Crie conta: https://analytics.google.com
2. Crie uma propriedade para inttools.com.br
3. Copie o ID (começa com G-)
4. Adicione na Vercel

---

### 3. Melhor Envio (Já Configurado Localmente) - CRÍTICO
```
MELHOR_ENVIO_TOKEN = eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...
SHOP_ZIP_CODE = 17520110
```

**Status:** Token já foi gerado. Apenas adicionar na Vercel.

---

### 4. Mercado Pago - MUDAR PARA PRODUÇÃO - CRÍTICO
**Atualmente:** Modo TESTE (não processa pagamentos reais)

```
MERCADOPAGO_ACCESS_TOKEN = APP_USR-[PRODUCAO]
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY = APP_USR-[PRODUCAO]
```

**Como conseguir credenciais de PRODUÇÃO:**
1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em "Suas integrações"
3. Selecione a aplicação
4. **Clique em "Credenciais de produção"** (NÃO teste!)
5. Copie:
   - Access Token
   - Public Key
6. **SUBSTITUA** na Vercel as variáveis que estão como TESTE

⚠️ **SEM ISSO, NINGUÉM CONSEGUE PAGAR DE VERDADE!**

---

### 5. Outras Variáveis (Já Configuradas)
```
DATABASE_URL = [já configurado]
NEXT_PUBLIC_SUPABASE_URL = [já configurado]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [já configurado]
NEXT_PUBLIC_SITE_URL = https://www.inttools.com.br
```

---

## 📝 TAREFAS PÓS-DEPLOY

### 1. Cadastrar Peso/Dimensões dos Produtos - IMPORTANTE
**Onde:** https://www.inttools.com.br/admin/produtos

Para cada produto:
1. Clique em "Editar"
2. Preencha a seção azul "Dados de Frete":
   - Peso (kg): ex: 0,5
   - Largura (cm): ex: 20
   - Altura (cm): ex: 15
   - Comprimento (cm): ex: 10
3. Salve

**Sem isso:** Frete usa valores genéricos (não reais)

---

### 2. Adicionar Produtos Reais
- Fotos profissionais
- Descrições completas
- Preços corretos
- Estoque real

---

### 3. Teste Completo END-TO-END
1. Fazer uma compra teste (cartão real)
2. Verificar email de confirmação
3. Aprovar pagamento manualmente
4. Verificar email de aprovação
5. Adicionar código de rastreio
6. Verificar email de envio
7. Marcar como entregue
8. Verificar email de entrega

---

## 📊 MONITORAMENTO

### Google Analytics
- Acesse: https://analytics.google.com
- Veja em tempo real quem está visitando
- Acompanhe conversões

### Logs da Vercel
- https://vercel.com/kaesene/int-tools/logs
- Monitore erros
- Verifique emails sendo enviados

---

## 🎯 CHECKLIST FINAL ANTES DE DIVULGAR

- [ ] Resend configurado e testado (envie email teste)
- [ ] Google Analytics rastreando (verifique em tempo real)
- [ ] Mercado Pago em **PRODUÇÃO** (não teste!)
- [ ] Peso/dimensões de TODOS os produtos preenchidos
- [ ] Teste de compra completo funcionando
- [ ] Domínio personalizado configurado (inttools.com.br)
- [ ] Pelo menos 5 produtos com fotos profissionais

---

## 🆘 SUPORTE

**Problemas com configuração?**
- Verifique os logs da Vercel
- Teste localmente primeiro
- Consulte a documentação:
  - Resend: https://resend.com/docs
  - Google Analytics: https://analytics.google.com/analytics/web
  - Mercado Pago: https://www.mercadopago.com.br/developers

---

## 📧 EMAILS QUE SERÃO ENVIADOS

### 1. Confirmação de Pedido
**Quando:** Assim que o pedido é criado
**Para:** Email do cliente
**Conteúdo:** Número do pedido, itens, total, link para acompanhar

### 2. Pagamento Aprovado
**Quando:** Admin marca pedido como "paid" ou webhook do MP aprova
**Para:** Email do cliente
**Conteúdo:** Confirmação de aprovação, próximo passo

### 3. Pedido Enviado
**Quando:** Admin adiciona código de rastreio
**Para:** Email do cliente
**Conteúdo:** Código de rastreio, link para Correios

### 4. Pedido Entregue
**Quando:** Admin marca pedido como "delivered"
**Para:** Email do cliente
**Conteúdo:** Confirmação de entrega, política de troca (7 dias)

---

## 🔐 SEGURANÇA

- ✅ HTTPS (Vercel)
- ✅ Criptografia SSL
- ✅ Dados de cartão via Mercado Pago (PCI-DSS)
- ✅ LGPD compliant
- ✅ Autenticação segura (Supabase)

---

**Status:** Sistema 100% funcional. Falta apenas configurar as variáveis de ambiente na Vercel!
