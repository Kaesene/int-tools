# ✅ CHECKLIST - Migração INT Tools para Outro PC

## 📦 NESTE PC (Atual)

### 1. Verificar Status do Git
- [ ] Verificar se todos os arquivos estão commitados
- [ ] Fazer push final para o GitHub
- [ ] Confirmar que está tudo no repositório remoto

```bash
cd C:\Users\Thiago\Desktop\int-tools
git status
git add .
git commit -m "Update: preparando migração"
git push origin master
```

### 2. Anotar Informações Importantes
- [ ] URL do repositório: `https://github.com/Kaesene/int-tools`
- [ ] Nome do projeto: **INT Tools**
- [ ] Stack: Next.js 14 + TypeScript + Tailwind CSS

---

## 💻 NO OUTRO PC (Novo)

### 3. Instalar Ferramentas Necessárias

- [ ] **Node.js** (versão 18 ou superior)
  - Download: https://nodejs.org
  - Verificar: `node --version`

- [ ] **Git**
  - Download: https://git-scm.com
  - Verificar: `git --version`

- [ ] **GitHub CLI** (opcional, mas recomendado)
  - Download: https://cli.github.com
  - Verificar: `gh --version`

- [ ] **Editor de Código** (VS Code recomendado)
  - Download: https://code.visualstudio.com

### 4. Configurar Git

```bash
# Configurar seu nome
git config --global user.name "Thiago Bernardineli"

# Configurar seu email
git config --global user.email "seu-email@exemplo.com"
```

### 5. Clonar o Repositório

```bash
# Navegar até a pasta desejada (ex: Desktop)
cd Desktop

# Clonar o repositório
git clone https://github.com/Kaesene/int-tools.git

# Entrar na pasta do projeto
cd int-tools
```

### 6. Instalar Dependências

```bash
# Instalar todos os pacotes
npm install

# Aguardar instalação completa (pode demorar 2-5 minutos)
```

### 7. Verificar Instalação

```bash
# Listar arquivos do projeto
dir  # Windows
# ou
ls -la  # Mac/Linux

# Verificar package.json
cat package.json
```

### 8. Testar o Projeto Localmente

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Abrir no navegador: http://localhost:3000
```

### 9. Fazer Alterações (Quando Necessário)

```bash
# Verificar status
git status

# Adicionar arquivos modificados
git add .

# Fazer commit
git commit -m "Descrição das alterações"

# Enviar para GitHub
git push origin master
```

---

## 🚀 DEPLOY NA VERCEL (Fazer uma vez no PC novo)

### 10. Conectar com Vercel

**Opção 1: Via Interface Web (Mais Fácil)**
- [ ] Acessar: https://vercel.com
- [ ] Login com GitHub
- [ ] Clicar em "Add New Project"
- [ ] Selecionar repositório `int-tools`
- [ ] Clicar em "Deploy"
- [ ] Aguardar deploy (2-3 minutos)
- [ ] Anotar URL de produção

**Opção 2: Via CLI**
```bash
# Login na Vercel
npx vercel login

# Deploy
npx vercel --prod
```

---

## 📝 COMANDOS ÚTEIS RESUMIDOS

```bash
# Ver status do Git
git status

# Baixar atualizações do GitHub
git pull

# Adicionar todas as alterações
git add .

# Fazer commit
git commit -m "Sua mensagem"

# Enviar para GitHub
git push

# Iniciar servidor local
npm run dev

# Fazer build de produção
npm run build

# Iniciar versão de produção
npm start
```

---

## ⚠️ PROBLEMAS COMUNS E SOLUÇÕES

### Erro: "npm: command not found"
- **Solução:** Instalar Node.js e reiniciar terminal

### Erro: "Permission denied"
- **Solução (Windows):** Executar terminal como Administrador
- **Solução (Mac/Linux):** Usar `sudo` antes do comando

### Erro: "Port 3000 already in use"
- **Solução:** Matar processo na porta 3000
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID [número] /F

  # Mac/Linux
  lsof -ti:3000 | xargs kill -9
  ```

### Dependências não instalam
- **Solução:** Deletar `node_modules` e `package-lock.json`, rodar `npm install` novamente
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

---

## 🎯 ESTRUTURA DO PROJETO

```
int-tools/
├── app/                    # Páginas Next.js
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Homepage
├── components/            # Componentes React
│   ├── layout/           # Header, Footer
│   ├── product/          # ProductCard
│   └── ui/               # Button, etc
├── types/                # TypeScript types
├── lib/                  # Utilitários
├── public/               # Arquivos estáticos
├── package.json          # Dependências
└── README.md            # Documentação

```

---

## 📞 SUPORTE

- **GitHub Issues:** https://github.com/Kaesene/int-tools/issues
- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs

---

**Data de criação:** 24/11/2025
**Projeto:** INT Tools - E-commerce de Ferramentas e Tecnologia
**Status Atual:** Fase 1 Completa (MVP)
