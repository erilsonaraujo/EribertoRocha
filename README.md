# Dr. Eriberto Rocha - Website Oficial

Site profissional modernizado para o escritório de advocacia do Dr. José Eriberto Rocha Jr., especialista em Direito Condominial em Natal/RN.

## 🚀 Características

- **Design Moderno**: Interface com liquid glass effect inspirado no iOS
- **Totalmente Responsivo**: Otimizado para desktop, tablet e mobile
- **Performance**: Build otimizado com Vite
- **SEO Otimizado**: Meta tags e estrutura semântica
- **Animações Suaves**: Transições e efeitos modernos

## 🛠️ Tecnologias

- HTML5
- CSS3 (Vanilla CSS com design moderno)
- JavaScript (ES6+)
- Vite (Build tool)
- Font Awesome (Ícones)

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🌐 Deploy no Vercel

O projeto está configurado para deploy automático no Vercel:

1. Faça push do código para o GitHub (veja instruções abaixo)
2. Conecte seu repositório ao Vercel
3. O Vercel detectará automaticamente as configurações do `vercel.json`
4. Deploy automático a cada push na branch `main`

### Configuração do Vercel

O arquivo `vercel.json` já está configurado com:
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

## 📤 Push para GitHub

O repositório Git já foi inicializado e configurado. Para fazer o push:

```bash
# Você precisará autenticar com o GitHub
git push -u origin main
```

**Opções de autenticação:**

1. **SSH** (Recomendado):
   ```bash
   # Alterar remote para SSH
   git remote set-url origin git@github.com:erilsonaraujo/EribertoRocha.git
   git push -u origin main
   ```

2. **Personal Access Token**:
   - Crie um token em: https://github.com/settings/tokens
   - Use o token como senha quando solicitado

3. **GitHub CLI**:
   ```bash
   gh auth login
   git push -u origin main
   ```

## 📝 Informações de Contato

- **WhatsApp**: +55 84 99165-1655
- **Email**: erilson.araujo@gmail.com
- **Instagram**: [@eacondominio](https://www.instagram.com/eacondominio/)
- **Endereço**: Rua Doutor Lauro Pinto, 520 - Lagoa Nova, Natal/RN

## 👨‍💻 Desenvolvimento

**Desenvolvido por**: Erilson Araujo  
**Email**: erilson.araujo@gmail.com  
**Website**: [brancoia.com.br](https://www.brancoia.com.br)

## 📄 Licença

© 2025 Dr. José Eriberto Rocha Jr. - Todos os direitos reservados.

## 🔄 Atualizações Recentes

- ✅ Design liquid glass no header (iOS-inspired)
- ✅ Atualização do número do WhatsApp
- ✅ Link do Instagram adicionado
- ✅ Animações modernas e suaves
- ✅ Otimização de performance
- ✅ Configuração para Vercel
- ✅ Correção de overlapping no hero section
