
document.addEventListener('DOMContentLoaded', () => {
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeButton = document.getElementById('chatbot-close-button');
    const sendButton = document.getElementById('chatbot-send-button');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    const apiUrl = 'https://personalchatbot-poxv.onrender.com/api/v1/chat';

    chatbotButton.addEventListener('click', () => {
        chatbotWindow.style.display = 'flex';
        chatbotWindow.classList.remove('closing');
        chatbotWindow.classList.add('opening');
        chatbotButton.style.display = 'none';
        addWelcomeMessage();
    });

    closeButton.addEventListener('click', () => {
        chatbotWindow.classList.remove('opening');
        chatbotWindow.classList.add('closing');
        setTimeout(() => {
            chatbotWindow.style.display = 'none';
            chatbotButton.style.display = 'flex';
        }, 400); // Match animation duration
    });

    sendButton.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function addWelcomeMessage() {
        // Clear previous messages
        chatbotMessages.innerHTML = '';
        addMessage('ai', 'Hello! How can I help you today?');
    }

    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            addMessage('user', message);
            chatbotInput.value = '';
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            })
            .then(response => response.json())
            .then(data => {
                addMessage('ai', data.reply);
            })
            .catch(error => {
                console.error('Error:', error);
                addMessage('ai', 'Sorry, something went wrong. Please try again later.');
            });
        }
    }

    function addMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chatbot-message', sender);

        const iconElement = document.createElement('div');
        iconElement.classList.add('icon');
        iconElement.innerHTML = sender === 'user' 
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 7.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"/><path d="M18 16s-2-4-6-4-6 4-6 4"/><path d="M12 12v4"/><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`;

        const textElement = document.createElement('div');
        textElement.classList.add('text');
        textElement.innerText = text;

        messageElement.appendChild(iconElement);
        messageElement.appendChild(textElement);
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
});
