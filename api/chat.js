import { GoogleGenerativeAI } from "@google/generative-ai";

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

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message, history } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing");
            return res.status(500).json({ error: "Server configuration error: API Key missing" });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_PROMPT_LUANNA,
        });

        // Convert frontend history format to Gemini format
        // Ensure history is an array and filter out any invalid messages
        const chatHistory = (Array.isArray(history) ? history : []).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: typeof msg.content === 'string' ? msg.content : '' }]
        })).filter(msg => msg.parts[0].text.trim() !== '');

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
        // Return a more specific error message if possible, but safe for client
        const errorMessage = error.message || "Erro desconhecido na IA";
        res.status(500).json({ error: "Erro no servidor da IA: " + errorMessage });
    }
}
