/**
 * Luanna - Assistente Jurídica Virtual
 * Lógica do Chat e Integrações (Backend Real)
 */

const INITIAL_MESSAGE = "Olá! Sou Luanna, assistente jurídica do Dr. Eriberto Rocha. Como posso ajudar com seu condomínio ou questão jurídica hoje?";

class LuannaChat {
    constructor() {
        this.chatContainer = null;
        this.messagesContainer = null;
        this.inputField = null;
        this.sendButton = null;
        this.isOpen = false;
        this.messageHistory = [];
        this.isTyping = false;
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

    async handleUserMessage() {
        if (this.isTyping) return;

        const text = this.inputField.value.trim();
        if (!text) return;

        // Add user message
        this.addMessage(text, 'user');
        this.inputField.value = '';
        this.messageHistory.push({ role: 'user', content: text });

        // Show typing indicator
        this.showTypingIndicator();
        this.isTyping = true;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text,
                    history: this.messageHistory.slice(0, -1) // Send history excluding current message (or include it if backend expects)
                    // Actually, let's send the full history excluding the just added message if the backend adds it, 
                    // but usually we send history so far. 
                    // My backend implementation converts history. Let's send the history BEFORE this new message, 
                    // and the new message as 'message'.
                }),
            });

            if (!response.ok) {
                throw new Error('Erro na comunicação com a IA');
            }

            const data = await response.json();
            const botResponse = data.response;

            this.removeTypingIndicator();
            this.addMessage(botResponse, 'bot');
            this.messageHistory.push({ role: 'assistant', content: botResponse });
            this.isTyping = false;

            // Check for conversion keywords in the response or just always show buttons if appropriate
            // The prompt instructs the AI to "Apresentar botões". 
            // We can detect if the AI *says* something about buttons, or just rely on the text.
            // However, to be safe and ensure buttons appear when needed, let's check for keywords in the AI response
            // OR if the user's message had intent.
            // Actually, the prompt says "Apresentar botões...". The AI might output text like "[BOTÕES]".
            // But since we want to render HTML buttons, we can look for a flag or just heuristic.
            // Let's use a heuristic: if the response mentions "WhatsApp" or "agendar" or "link", show buttons.

            const lowerResponse = botResponse.toLowerCase();
            if (lowerResponse.includes('whatsapp') || lowerResponse.includes('agendar') || lowerResponse.includes('calendly') || lowerResponse.includes('link')) {
                this.showActionButtons();
            }

        } catch (error) {
            console.error('Erro completo:', error);
            console.error('Tipo de erro:', error.name);
            console.error('Mensagem:', error.message);

            this.removeTypingIndicator();

            let errorMessage = "Desculpe, estou com dificuldade de conexão no momento.";

            if (error.message.includes('Failed to fetch')) {
                errorMessage = "Não consegui conectar ao servidor. Verifique se o backend está rodando (npm run server).";
                console.error('DICA: Execute "npm run server" em outro terminal');
            }

            this.addMessage(errorMessage + " Por favor, tente novamente ou fale diretamente no WhatsApp.", 'bot');
            this.showActionButtons();
            this.isTyping = false;
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        // Simple markdown parsing for bold text
        const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        contentDiv.innerHTML = formattedText;

        if (sender === 'bot') {
            const avatar = document.createElement('div');
            avatar.className = 'chat-avatar';
            avatar.innerHTML = '<i class="fas fa-user-tie"></i>';
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
        // Avoid duplicate buttons at the very bottom
        const lastElement = this.messagesContainer.lastElementChild;
        if (lastElement && lastElement.classList.contains('chat-actions')) {
            return;
        }

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'chat-actions';

        // Generate WhatsApp Summary
        const summary = this.messageHistory
            .map(m => `${m.role === 'user' ? 'Cliente' : 'Luanna'}: ${m.content}`)
            .join('\n')
            .substring(0, 800);

        const whatsappText = encodeURIComponent(
            `Olá, Dr. Eriberto! Vim do site através da assistente Luanna.\n\n*Resumo da conversa:*\n${summary}\n\nGostaria de orientações.`
        );

        buttonsDiv.innerHTML = `
            <a href="https://wa.me/5584991776106?text=${whatsappText}" target="_blank" class="chat-btn whatsapp-btn">
                <i class="fab fa-whatsapp"></i> Falar com Dr. Eriberto no WhatsApp
            </a>
            <a href="#agendamento" class="chat-btn schedule-btn">
                <i class="far fa-calendar-alt"></i> Agendar uma reunião de 30 minutos
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
