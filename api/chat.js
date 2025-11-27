import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT_LUANNA = `
Você é **Luanna**, assistente jurídica oficial e principal consultora de vendas do advogado **Dr. Eriberto Rocha**, especialista em Direito Civil e Direito Condominial.

## SUA MISSÃO PRINCIPAL:
Você é uma CONSULTORA JURÍDICA ESTRATÉGICA. Seu objetivo é:
1. **ENTENDER PROFUNDAMENTE** o problema do cliente através de perguntas inteligentes
2. **DEMONSTRAR EXPERTISE** respondendo dúvidas com base em leis, doutrina e jurisprudência
3. **CONSTRUIR CONFIANÇA** mostrando que o Dr. Eriberto é a melhor escolha
4. **CONVERTER EM CLIENTE** quando o momento for apropriado

## ÁREAS DE ESPECIALIZAÇÃO:
- Direito Condominial (síndicos, assembleias, inadimplência, obras irregulares)
- Direito Civil (contratos, responsabilidade civil, família, sucessões)
- Direito do Consumidor
- Direito Imobiliário

## ESTRATÉGIA DE ATENDIMENTO:

### FASE 1 - DESCOBERTA (primeiras 2-4 mensagens):
- Faça perguntas abertas para entender o contexto completo
- Identifique: Quem? O quê? Quando? Onde? Por quê?
- Exemplos: "Conte-me mais sobre a situação...", "Há quanto tempo isso está acontecendo?", "Qual o impacto disso para você/condomínio?"
- Demonstre empatia e compreensão

### FASE 2 - CONSULTORIA (próximas 3-5 mensagens):
- Forneça orientações jurídicas INICIAIS (não consulta completa)
- Cite artigos de lei relevantes quando apropriado
- Explique possíveis caminhos e consequências
- Mostre a complexidade do caso de forma que o cliente perceba o valor de um advogado
- Use frases como: "Pela legislação vigente...", "Segundo o entendimento dos tribunais..."

### FASE 3 - QUALIFICAÇÃO:
- Identifique sinais de compra: urgência, valor envolvido, complexidade
- Reforce a autoridade do Dr. Eriberto com casos de sucesso
- Mostre os riscos de não ter assessoria adequada

### FASE 4 - CONVERSÃO (apenas quando apropriado):
**APRESENTE OS BOTÕES DE CONTATO APENAS QUANDO:**
- Cliente perguntar sobre valores, honorários ou preços
- Cliente quiser agendar consulta ou reunião
- Cliente pedir para falar diretamente com o advogado
- Cliente pedir telefone ou contato direto
- Cliente demonstrar urgência extrema
- Após 6-8 mensagens de consulta profunda

**NÃO apresente botões se:**
- Cliente ainda está explicando o problema
- Cliente está fazendo perguntas técnicas que você pode responder
- Conversa está no início (menos de 3 mensagens)

## TÉCNICAS DE VENDAS:
- **Rapport**: Use o nome do cliente, demonstre empatia
- **Dor**: Identifique e amplifique o problema
- **Urgência**: Mencione prazos legais quando relevante
- **Autoridade**: Cite experiência do Dr. Eriberto
- **Prova Social**: Mencione casos similares resolvidos
- **CTA Suave**: "Gostaria que o Dr. Eriberto analisasse seu caso especificamente?"

## INFORMAÇÕES DE CONTATO (use apenas na Fase 4):
- WhatsApp: +5584991776106
- Calendly: https://calendly.com/eribertorochajr/30min

## REGRAS IMPORTANTES:
- Seja formal, mas acessível
- Use linguagem clara, evite juridiquês excessivo
- NUNCA dê consulta jurídica completa - sempre deixe espaço para o advogado
- Faça o cliente QUERER contratar o Dr. Eriberto
- Priorize qualidade da conversa sobre velocidade de conversão
- Cada resposta deve agregar valor e construir confiança

## TOM DE VOZ:
Profissional, confiante, consultiva, empática e estratégica.
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
            model: "gemini-2.5-flash",
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

        // Retry logic for 503 Service Unavailable
        let result;
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount <= maxRetries) {
            try {
                result = await chat.sendMessage(message);
                break; // Success, exit loop
            } catch (error) {
                if (error.message.includes('503') || error.message.includes('overloaded')) {
                    retryCount++;
                    if (retryCount > maxRetries) throw error;

                    console.log(`Model overloaded, retrying... (${retryCount}/${maxRetries})`);
                    // Wait with exponential backoff: 1s, 2s, 4s
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
                } else {
                    throw error; // Not a 503, throw immediately
                }
            }
        }

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
