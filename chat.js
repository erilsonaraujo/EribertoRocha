/**
 * Luanna - Assistente Jurídica Virtual
 * Lógica do Chat e Integrações
 */

const LUANNA_SYSTEM_PROMPT = `
Você é Luanna, assistente jurídica oficial do advogado Dr. Eriberto Rocha, especialista em Direito Civil Condominial.
Seu papel é:
Responder dúvidas jurídicas com base nas leis, doutrina e jurisprudências atualizadas.
Atuar como closer de vendas, guiando o cliente para contratar a assessoria jurídica.
Priorizar atendimento para síndicos e condomínios.
`;

const INITIAL_MESSAGE = "Olá! Sou Luanna, assistente jurídica do Dr. Eriberto Rocha. Como posso ajudar com seu condomínio ou questão jurídica hoje?";

// Base de conhecimento simulada (Keywords -> Resposta)
const KNOWLEDGE_BASE = [
    {
        keywords: ['valor', 'preço', 'quanto custa', 'honorários', 'orçamento'],
        response: "Para passar um orçamento preciso, o Dr. Eriberto precisa analisar a complexidade do seu caso. Podemos agendar uma breve reunião ou você pode me dar mais detalhes por aqui?",
        action: 'offer_contact'
    },
    {
        keywords: ['inadimplência', 'cobrança', 'devedor', 'atrasado', 'pagamento'],
        response: "A inadimplência é um problema sério que afeta o caixa do condomínio. O Dr. Eriberto é especialista em recuperação de crédito, atuando tanto na cobrança extrajudicial quanto judicial, sempre buscando a forma mais rápida de reaver os valores.",
        action: 'offer_contact'
    },
    {
        keywords: ['barulho', 'som alto', 'perturbação', 'vizinho'],
        response: "Perturbação do sossego é uma das maiores causas de conflitos. O condomínio deve seguir o Regimento Interno e aplicar advertências ou multas se necessário. O Dr. Eriberto pode orientar sobre a aplicação correta dessas penalidades para evitar anulações judiciais.",
        action: 'offer_contact'
    },
    {
        keywords: ['síndico', 'administradora', 'gestão'],
        response: "Para síndicos e administradoras, oferecemos uma assessoria preventiva completa, que vai desde a análise de contratos até o acompanhamento de assembleias. Isso traz segurança jurídica para sua gestão.",
        action: 'offer_contact'
    },
    {
        keywords: ['agendar', 'reunião', 'marcar', 'horário'],
        response: "Ótimo! Você pode agendar uma reunião diretamente pelo nosso calendário online ou falar com o Dr. Eriberto pelo WhatsApp.",
        action: 'show_buttons'
    },
    {
        keywords: ['whatsapp', 'zap', 'contato', 'telefone'],
        response: "Claro! Você pode falar diretamente com o Dr. Eriberto pelo WhatsApp abaixo.",
        action: 'show_buttons'
    }
];

const DEFAULT_RESPONSE = "Entendo. Essa é uma questão que requer uma análise jurídica cuidadosa. Como assistente, recomendo que você converse diretamente com o Dr. Eriberto para ter uma orientação segura e personalizada.";

class LuannaChat {
    constructor() {
        this.chatContainer = null;
        this.messagesContainer = null;
        this.inputField = null;
        this.sendButton = null;
        this.isOpen = false; // Chat inline is always open, but we might want a toggle later
        this.messageHistory = [];
    }

    init() {
        this.chatContainer = document.getElementById('luanna-chat-interface');
        if (!this.chatContainer) return;

        this.messagesContainer = document.getElementById('chat-messages');
        this.inputField = document.getElementById('chat-input');
        this.sendButton = document.getElementById('chat-send');

        this.addMessage(INITIAL_MESSAGE, 'bot');

        this.sendButton.addEventListener('click', () => this.handleUserMessage());
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserMessage();
        });
    }

    handleUserMessage() {
        const text = this.inputField.value.trim();
        if (!text) return;

        // Add user message
        this.addMessage(text, 'user');
        this.inputField.value = '';
        this.messageHistory.push({ role: 'user', content: text });

        // Simulate typing delay
        this.showTypingIndicator();

        setTimeout(() => {
            this.removeTypingIndicator();
            this.generateResponse(text);
        }, 1500);
    }

    generateResponse(userText) {
        const lowerText = userText.toLowerCase();
        let match = KNOWLEDGE_BASE.find(item =>
            item.keywords.some(keyword => lowerText.includes(keyword))
        );

        const responseText = match ? match.response : DEFAULT_RESPONSE;
        const action = match ? match.action : 'offer_contact';

        this.addMessage(responseText, 'bot');
        this.messageHistory.push({ role: 'assistant', content: responseText });

        if (action === 'offer_contact' || action === 'show_buttons') {
            this.showActionButtons();
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;

        if (sender === 'bot') {
            const avatar = document.createElement('div');
            avatar.className = 'chat-avatar';
            avatar.innerHTML = '<i class="fas fa-user-tie"></i>'; // Placeholder icon
            messageDiv.appendChild(avatar);
        }

        messageDiv.appendChild(contentDiv);
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'chat-message bot-message typing';
        typingDiv.innerHTML = `
            <div class="chat-avatar"><i class="fas fa-user-tie"></i></div>
            <div class="message-content">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        `;
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingDiv = document.getElementById('typing-indicator');
        if (typingDiv) typingDiv.remove();
    }

    showActionButtons() {
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'chat-actions';

        // Generate WhatsApp Summary
        const summary = this.messageHistory
            .map(m => `${m.role === 'user' ? 'Cliente' : 'Luanna'}: ${m.content}`)
            .join('\n')
            .substring(0, 500); // Limit length

        const whatsappText = encodeURIComponent(
            `Olá, Dr. Eriberto! Vim do site através da assistente Luanna.\n\n*Resumo da conversa:*\n${summary}\n\nGostaria de orientações.`
        );

        buttonsDiv.innerHTML = `
            <a href="https://wa.me/5584991776106?text=${whatsappText}" target="_blank" class="chat-btn whatsapp-btn">
                <i class="fab fa-whatsapp"></i> Falar no WhatsApp
            </a>
            <a href="#agendamento" class="chat-btn schedule-btn">
                <i class="far fa-calendar-alt"></i> Agendar Reunião
            </a>
        `;

        this.messagesContainer.appendChild(buttonsDiv);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Initialize Chat
const luannaChat = new LuannaChat();
document.addEventListener('DOMContentLoaded', () => {
    luannaChat.init();
});
