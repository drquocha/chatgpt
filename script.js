// Configuration from config.js
const OPENAI_API_KEY = window.CONFIG.OPENAI_API_KEY;
const MODEL = window.CONFIG.MODEL;
const MAX_TOKENS = window.CONFIG.MAX_TOKENS;
const TEMPERATURE = window.CONFIG.TEMPERATURE;

// DOM Elements
const authContainer = document.getElementById('authContainer');
const chatContainer = document.getElementById('chatContainer');
const authForm = document.getElementById('authForm');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const toggleText = document.getElementById('toggleText');
const toggleLink = document.getElementById('toggleLink');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const logoutBtn = document.getElementById('logoutBtn');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// State
let isLoginMode = true;
let currentUser = null;
let users = JSON.parse(localStorage.getItem('chatgpt_users') || '{}');
let userChats = JSON.parse(localStorage.getItem('chatgpt_chats') || '{}');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkAuthState();
    setupEventListeners();
});

function setupEventListeners() {
    authForm.addEventListener('submit', handleAuth);
    toggleLink.addEventListener('click', toggleAuthMode);
    logoutBtn.addEventListener('click', logout);
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function checkAuthState() {
    const loggedInUser = localStorage.getItem('chatgpt_current_user');
    if (loggedInUser && users[loggedInUser]) {
        currentUser = loggedInUser;
        showChatInterface();
    }
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    if (isLoginMode) {
        formTitle.textContent = 'Login';
        submitBtn.textContent = 'Login';
        toggleText.textContent = "Don't have an account?";
        toggleLink.textContent = 'Sign up';
    } else {
        formTitle.textContent = 'Sign Up';
        submitBtn.textContent = 'Sign Up';
        toggleText.textContent = 'Already have an account?';
        toggleLink.textContent = 'Login';
    }
}

function handleAuth(e) {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Reload users from localStorage to get latest data
    users = JSON.parse(localStorage.getItem('chatgpt_users') || '{}');

    if (isLoginMode) {
        // Login
        if (users[username] && users[username].password === password) {
            currentUser = username;
            localStorage.setItem('chatgpt_current_user', username);
            showChatInterface();
        } else {
            alert('Invalid username or password');
        }
    } else {
        // Sign up
        if (users[username]) {
            alert('Username already exists');
            return;
        }

        users[username] = {
            password: password,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('chatgpt_users', JSON.stringify(users));

        currentUser = username;
        localStorage.setItem('chatgpt_current_user', username);

        // Initialize empty chat history for new user
        if (!userChats[username]) {
            userChats[username] = [];
            localStorage.setItem('chatgpt_chats', JSON.stringify(userChats));
        }

        showChatInterface();
    }

    // Clear form
    usernameInput.value = '';
    passwordInput.value = '';
}

function showChatInterface() {
    authContainer.style.display = 'none';
    chatContainer.style.display = 'flex';
    loadChatHistory();
    messageInput.focus();
}

function logout() {
    localStorage.removeItem('chatgpt_current_user');
    currentUser = null;
    authContainer.style.display = 'block';
    chatContainer.style.display = 'none';
    chatMessages.innerHTML = '';
}

function loadChatHistory() {
    const userMessages = userChats[currentUser] || [];
    chatMessages.innerHTML = '';

    userMessages.forEach(message => {
        addMessageToChat(message.content, message.role);
    });

    scrollToBottom();
}

function addMessageToChat(content, role) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role === 'user' ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function saveMessage(content, role) {
    if (!userChats[currentUser]) {
        userChats[currentUser] = [];
    }

    userChats[currentUser].push({
        content: content,
        role: role,
        timestamp: new Date().toISOString()
    });

    localStorage.setItem('chatgpt_chats', JSON.stringify(userChats));
}

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Disable input while processing
    messageInput.disabled = true;
    sendBtn.disabled = true;

    // Add user message to chat
    addMessageToChat(message, 'user');
    saveMessage(message, 'user');

    // Clear input
    messageInput.value = '';

    // Show loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-message loading';
    loadingDiv.textContent = 'Thinking...';
    chatMessages.appendChild(loadingDiv);
    scrollToBottom();

    try {
        let response;

        // Check if we're running on a server (has /api/chat endpoint)
        if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
            try {
                // Try server proxy first
                response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: message,
                        apiKey: OPENAI_API_KEY
                    })
                });
            } catch (proxyError) {
                console.log('Proxy failed, trying direct API call:', proxyError);
                // Fallback to direct API call
                response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENAI_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: MODEL,
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a helpful assistant. Be concise and helpful in your responses.'
                            },
                            {
                                role: 'user',
                                content: message
                            }
                        ],
                        max_tokens: MAX_TOKENS,
                        temperature: TEMPERATURE
                    })
                });
            }
        } else {
            // Running from file:// protocol, try direct API call
            response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful assistant. Be concise and helpful in your responses.'
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    max_tokens: MAX_TOKENS,
                    temperature: TEMPERATURE
                })
            });
        }

        // Remove loading indicator
        chatMessages.removeChild(loadingDiv);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Response:', response.status, errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        const botMessage = data.choices[0].message.content;

        // Add bot response to chat
        addMessageToChat(botMessage, 'assistant');
        saveMessage(botMessage, 'assistant');

    } catch (error) {
        console.error('Error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });

        chatMessages.removeChild(loadingDiv);

        let errorMessage = 'Sorry, there was an error processing your request.';

        if (error.message.includes('401')) {
            errorMessage = 'API key is invalid. Please check the configuration.';
        } else if (error.message.includes('429')) {
            errorMessage = 'Rate limit exceeded. Please try again later.';
        } else if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
            errorMessage = 'CORS Error: Cannot call OpenAI API directly from browser. You need to deploy this to a server or use a proxy service.';
        } else if (error.message.includes('403')) {
            errorMessage = 'Access forbidden. Check if your API key has the required permissions.';
        }

        addMessageToChat(errorMessage, 'assistant');
        saveMessage(errorMessage, 'assistant');
    }

    // Re-enable input
    messageInput.disabled = false;
    sendBtn.disabled = false;
    messageInput.focus();
}