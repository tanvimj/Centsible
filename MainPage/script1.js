class CentsibleChatbot {
            constructor() {
                this.isConnected = false;
                this.responseTime = 0;
                this.messageHistory = [];
                this.init();
            }

            init() {
                this.updateStatus('Connecting...', 'connecting');
                
                // Simulate connection attempt
                setTimeout(() => {
                    this.testConnection();
                }, 1000);

                this.setupEventListeners();
            }

            setupEventListeners() {
                // Chat trigger button
                document.getElementById('chat-trigger').addEventListener('click', () => {
                    this.toggleChat();
                });

                // Close chat button
                document.getElementById('chat-close').addEventListener('click', () => {
                    this.closeChat();
                });

                // Send message
                document.getElementById('chat-send').addEventListener('click', () => {
                    this.sendMessage();
                });

                // Enter key to send
                document.getElementById('chat-input').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.sendMessage();
                    }
                });
            }

            testConnection() {
                // Simulate connection test
                const startTime = Date.now();
                
                setTimeout(() => {
                    const endTime = Date.now();
                    this.responseTime = endTime - startTime;
                    this.isConnected = true;
                    
                    this.updateStatus('Connected & Ready', 'connected');
                    document.getElementById('response-time').textContent = `~${this.responseTime}ms`;
                    document.getElementById('bot-status-text').textContent = 'Online';
                }, Math.random() * 1000 + 500);
            }

            updateStatus(message, type) {
                const statusDot = document.getElementById('bot-status');
                const statusText = document.getElementById('status-text');
                
                statusText.textContent = message;
                statusDot.className = `status-dot ${type === 'connected' ? 'connected' : 'error'}`;
            }

            toggleChat() {
                const chatWindow = document.getElementById('chat-window');
                chatWindow.classList.toggle('active');
            }

            closeChat() {
                const chatWindow = document.getElementById('chat-window');
                chatWindow.classList.remove('active');
            }

            sendMessage() {
                const input = document.getElementById('chat-input');
                const message = input.value.trim();
                
                if (!message) return;

                // Add user message
                this.addMessage(message, 'user');
                input.value = '';

                // Simulate bot response
                setTimeout(() => {
                    const response = this.generateResponse(message);
                    this.addMessage(response, 'bot');
                }, 1000 + Math.random() * 1000);
            }

            addMessage(text, sender) {
                const messagesContainer = document.getElementById('chat-messages');
                const messageDiv = document.createElement('div');
                messageDiv.className = `chat-message ${sender}`;
                messageDiv.textContent = text;
                
                messagesContainer.appendChild(messageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }

            generateResponse(userMessage) {
    const message = userMessage.toLowerCase();

    const followUps = [
        "Need help visualizing that?",
        "Would you like me to suggest a monthly plan?",
        "Want to know what most users in your age group spend on?",
        "Curious how much you've spent this week?",
        "Should I send you a budgeting tip of the day?",
    ];

    const emojis = ["💡", "💸", "📊", "✅", "📉", "🧠"];

    function randomFollowUp() {
        return followUps[Math.floor(Math.random() * followUps.length)];
    }

    function randomEmoji() {
        return emojis[Math.floor(Math.random() * emojis.length)];
    }

    if (message.includes('expense') || message.includes('spend')) {
        return `Tracking expenses is what I live for ${randomEmoji()}! Just tell me what you spent, and I’ll log it like a champ. ${randomFollowUp()}`;
    } else if (message.includes('budget') || message.includes('save')) {
        return `Ah, budgeting — the art of not crying at month-end 😅. I recommend the 50/30/20 rule: 50% needs, 30% wants, 20% savings. ${randomFollowUp()}`;
    } else if (message.includes('category') || message.includes('categories')) {
        return `We've got classic categories like 🍕 Food, 🚌 Transport, 🛍️ Shopping, and even ☕ Coffee addiction. Want to add a custom one?`;
    } else if (message.includes('how are you') || message.includes('hi') || message.includes('hello')) {
        return `Hey you! 👋 I'm feeling financially optimistic today. Ready to make cents out of your cents?`;
    } else if (message.includes('help') || message.includes('what can you do')) {
        return `Here's my skillset:  
        • Track your expenses 📒  
        • Analyze your spending trends 📈  
        • Set savings goals 🎯  
        • Give budgeting tips 💰  
        • Occasionally throw shade at your coffee addiction ☕  
        ${randomFollowUp()}`;
    } else if (message.includes('goal') || message.includes('saving for')) {
        return `Goals? Love 'em! Whether it’s a trip to Goa or buying a PS5, I can help plan and track it. Want to start one now?`;
    } else if (message.includes('thank') || message.includes('thanks')) {
        return `You're welcome, money maestro! 🎩 Any more expenses or budgets I can jazz up?`;
    } else if (message.includes('weekly') || message.includes('month')) {
        return `You can totally view trends over time 📆. Want me to generate a sample weekly breakdown?`;
    } else {
        // Default generic reply
        const replies = [
            "Hmm, interesting! Want to talk expenses or savings?",
            "I’m not sure I got that. but hey, we can talk budgets any time!",
            "Try saying something like 'show me my expenses' or 'how do I save more'.",
            "Money talks and so do I! Ask me anything finance-ish.",
            `I'm here for you ${randomEmoji()} — ask about budgets, goals, categories, or anything in between!`,
        ];
        return replies[Math.floor(Math.random() * replies.length)];
    }
}

        }

        // Initialize chatbot
        const chatbot = new CentsibleChatbot();

        // Global functions for testing
        function testBotConnection() {
            chatbot.updateStatus('Testing connection...', 'connecting');
            chatbot.testConnection();
        }

        function reinitializeBot() {
            chatbot.updateStatus('Reinitializing...', 'connecting');
            setTimeout(() => {
                chatbot.init();
            }, 500);
        }

        // Demo expense functionality
        let totalExpenses = 0;
        let categories = new Set();

        document.getElementById('add-expense').addEventListener('click', function() {
            const amount = parseFloat(document.getElementById('amount').value);
            const category = document.getElementById('category').value;
            const mode = document.getElementById('mode').value;

            if (amount && category && mode) {
                totalExpenses += amount;
                categories.add(category);
                
                document.getElementById('daily-total').textContent = `₹${totalExpenses}`;
                document.getElementById('category-count').textContent = categories.size;
                
                // Clear form
                document.getElementById('amount').value = '';
                document.getElementById('category').value = '';
                document.getElementById('mode').value = '';
                
                // Auto-open chat with confirmation
                setTimeout(() => {
                    chatbot.addMessage(`Great! I've recorded your ₹${amount} expense in ${category}. Your daily total is now ₹${totalExpenses}.`, 'bot');
                    chatbot.toggleChat();
                }, 500);
            }
        });

        // Simulate some initial data
        setTimeout(() => {
            document.getElementById('integration-method').textContent = 'Custom WebSocket + REST API';
        }, 2000);