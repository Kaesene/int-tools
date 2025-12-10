# Como Adicionar o Logo para Aparecer no Google

## 📋 O que foi configurado:

✅ Dados estruturados Schema.org (Organization)
✅ Open Graph para redes sociais
✅ Twitter Cards
✅ Sitemap.xml
✅ Robots.txt

## 🎨 PASSO 1: Adicione seu logo

Você precisa adicionar um arquivo de imagem na pasta `public/` com o nome **`logo.png`**

### Requisitos do logo:

**Para o Google reconhecer:**
- Formato: PNG ou JPG
- Tamanho recomendado: **1200x630 pixels** (proporção 1.91:1)
- Tamanho máximo: 2MB
- Fundo: De preferência transparente (PNG)

### Onde colocar:

```
int-tools/
├── public/
│   └── logo.png    👈 COLOQUE AQUI
├── src/
└── ...
```

### Como fazer:

1. Abra seu programa de design (Canva, Photoshop, etc.)
2. Crie uma imagem 1200x630 pixels
3. Adicione seu logo centralizado
4. Salve como `logo.png`
5. Copie para a pasta `public/`

## 🚀 PASSO 2: Deploy

Depois de adicionar o logo, faça o deploy:

```bash
git add .
git commit -m "Adiciona logo para SEO do Google"
git push origin main
```

## ⏱️ Quanto tempo demora?

- **Google indexar:** 1-7 dias
- **Aparecer o logo:** 2-4 semanas (Google precisa validar)

## 🔍 Como verificar se funcionou:

### 1. Teste o Schema.org:
https://search.google.com/test/rich-results

### 2. Teste Open Graph (preview redes sociais):
https://www.opengraph.xyz/
https://cards-dev.twitter.com/validator

### 3. Google Search Console:
1. Acesse: https://search.google.com/search-console
2. Adicione seu site
3. Solicite indexação da homepage
4. Aguarde processamento

## 💡 Dicas extras:

### Se quiser logo diferente para redes sociais:

Crie também um `og-image.png` (1200x630) e atualize em:
`src/app/layout.tsx` → linha 33 → `/og-image.png`

### Se quiser adicionar redes sociais:

Edite: `src/components/seo/OrganizationSchema.tsx`

Descomente e adicione suas URLs:
```typescript
sameAs: [
  'https://www.facebook.com/inttools',
  'https://www.instagram.com/inttools',
],
```

## ❓ Problemas?

**Logo não aparece no Google após 4 semanas?**
- Verifique se o logo está acessível: https://www.inttools.com.br/logo.png
- Verifique se o site está indexado no Google Search Console
- O logo precisa estar no ar por semanas para o Google confiar

**Logo aparece cortado?**
- Use exatamente 1200x630 pixels
- Mantenha elementos importantes no centro (área segura: 800x400)
