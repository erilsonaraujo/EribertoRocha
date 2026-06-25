# 🤖 Configuração da IA Luanna no Vercel

## ⚠️ IMPORTANTE: Configure a API Key

Para a IA funcionar no Vercel, você **DEVE** adicionar a variável de ambiente:

### Passo a Passo:

1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Adicione uma nova variável:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: `Sua chave de API aqui` (Pegue em https://aistudio.google.com/app/apikey)
   - **Environment**: Production, Preview, Development (marque todos)
3. Clique em "Save"
4. **Redeploy** o projeto para aplicar as mudanças

### Teste Local

Para testar localmente:

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

Abra: http://localhost:5173

## ✅ Verificação

Se a IA estiver funcionando corretamente:
- Você verá a mensagem inicial da Luanna
- Ao digitar "oi", ela responderá normalmente
- Se houver erro, o console mostrará detalhes

## 🔧 Troubleshooting

**Erro: "Failed to fetch"**
- Local: Certifique-se de que `npm run server` está rodando
- Vercel: Verifique se a API Key está configurada

**Erro: "GEMINI_API_KEY not configured"**
- A variável de ambiente não está definida no Vercel
