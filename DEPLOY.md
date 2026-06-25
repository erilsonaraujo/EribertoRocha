# 🚀 Guia de Deploy - GitHub e Vercel

## ✅ Status Atual

O projeto está **100% pronto** para deploy! Tudo foi configurado:

- ✅ Git inicializado
- ✅ 3 commits criados
- ✅ Remote configurado: `https://github.com/erilsonaraujo/EribertoRocha.git`
- ✅ Branch: `main`
- ✅ Build testado e funcionando
- ✅ Vercel.json configurado

---

## 📤 Passo 1: Push para GitHub

### Opção A: GitHub CLI (Mais Fácil) ⭐

```bash
# Instalar GitHub CLI (se não tiver)
# Ubuntu/Debian:
sudo apt install gh

# Fedora:
sudo dnf install gh

# Autenticar
gh auth login

# Fazer push
cd /home/erilson/Documentos/erilsondigital/eribertorocha/eriberto/project
git push -u origin main
```

### Opção B: Personal Access Token

1. **Criar Token:**
   - Acesse: https://github.com/settings/tokens
   - Click em "Generate new token" → "Generate new token (classic)"
   - Marque: `repo` (todas as opções)
   - Click em "Generate token"
   - **COPIE O TOKEN** (você só verá uma vez!)

2. **Fazer Push:**
   ```bash
   cd /home/erilson/Documentos/erilsondigital/eribertorocha/eriberto/project
   git push -u origin main
   ```
   - Username: `erilsonaraujo`
   - Password: **cole o token aqui**

### Opção C: SSH (Mais Seguro para Uso Contínuo)

```bash
# Gerar chave SSH
ssh-keygen -t ed25519 -C "erilson.araujo@gmail.com"
# Pressione Enter 3 vezes (sem senha)

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub

# Adicionar no GitHub:
# 1. Vá em: https://github.com/settings/ssh/new
# 2. Cole a chave
# 3. Click em "Add SSH key"

# Mudar remote para SSH
cd /home/erilson/Documentos/erilsondigital/eribertorocha/eriberto/project
git remote set-url origin git@github.com:erilsonaraujo/EribertoRocha.git

# Fazer push
git push -u origin main
```

---

## 🌐 Passo 2: Deploy no Vercel

### Método Automático (Recomendado)

1. **Acesse:** https://vercel.com
2. **Login** com sua conta GitHub
3. Click em **"Add New Project"**
4. Click em **"Import Git Repository"**
5. Selecione: **`erilsonaraujo/EribertoRocha`**
6. Vercel detectará automaticamente:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. Click em **"Deploy"**
8. Aguarde 1-2 minutos ✨

### Seu site estará no ar em:
```
https://eriberto-rocha.vercel.app
```
(ou o nome que o Vercel gerar)

---

## 🔄 Atualizações Futuras

Após o setup inicial, é super simples:

```bash
# Fazer mudanças no código
# ...

# Commit e push
git add .
git commit -m "Descrição das mudanças"
git push

# Vercel faz deploy automático! 🎉
```

---

## ✅ Checklist Final

Antes de considerar completo:

- [ ] Push para GitHub realizado com sucesso
- [ ] Repositório visível em: https://github.com/erilsonaraujo/EribertoRocha
- [ ] Deploy no Vercel concluído
- [ ] Site acessível na URL do Vercel
- [ ] Testar WhatsApp button no site em produção
- [ ] Verificar link do Instagram
- [ ] Testar formulário de contato
- [ ] Verificar responsividade em celular

---

## 🆘 Problemas Comuns

### "Permission denied" no push
- **Solução**: Use GitHub CLI ou Personal Access Token

### "Repository not found"
- **Solução**: Verifique se o repositório existe em https://github.com/erilsonaraujo/EribertoRocha
- Se não existir, crie em: https://github.com/new

### Build falha no Vercel
- **Solução**: O build já foi testado localmente e funcionou. Se falhar:
  - Verifique os logs no Vercel
  - Confirme que `package.json` foi enviado
  - Rode `npm run build` localmente de novo

---

## 📞 Suporte

**Desenvolvedor:** Erilson Araujo  
**Email:** erilson.araujo@gmail.com  
**Website:** https://erilsondigital.com

---

## 🎉 Parabéns!

Seu site modernizado está pronto para o mundo! 🚀
