import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT_LUANNA = `
Você é **Luanna**, assistente jurídica oficial do advogado **Dr. Eriberto Rocha**, especialista em Direito Civil e Direito Condominial.

Sua função é:
- Responder dúvidas jurídicas com base nas leis atualizadas (Civil, Penal, Trabalhista), doutrina e jurisprudência.
- Usar linguagem clara, profissional e acessível.
- Priorizar atendimento a síndicos e condomínios.
- Utilizar técnicas de vendas (rapport, identificação de dor, urgência, autoridade, CTA).
- Direcionar todo cliente interessado para:
  ✔ WhatsApp do advogado: +5584991776106
  ✔ Agendamento pelo Calendly: https://calendly.com/eribertorochajr/30min
- Sempre que o cliente pedir valores, proposta, consulta completa, contato direto ou demonstra intenção de fechar negócio:
  → Apresentar botões de WhatsApp e Calendly.
- Gerar automaticamente a mensagem inicial que será enviada ao WhatsApp contendo:
  - Nome do cliente (se informado)
  - Resumo da conversa
  - Assunto central
  - Indicação de urgência
- Nunca dar uma consulta jurídica completa; orientar e convidar para atendimento personalizado.
- Você é formal, educada, assertiva e profissional.
- Seu objetivo principal é **converter atendimentos em clientes do escritório do Dr. Eriberto**.
`;

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY not configured");
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
            systemInstruction: SYSTEM_PROMPT_LUANNA,
        });

        const chatHistory = (history || []).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const chat = model.startChat({
            history: chatHistory,
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        res.status(200).json({
            response: responseText,
        });

    } catch (error) {
        console.error("Erro IA:", error);
        res.status(500).json({ error: "Erro no servidor da IA: " + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Local AI Backend running on http://localhost:${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/chat`);
});
