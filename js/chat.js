// MOBILE MENU
function toggleMenu() {
  const overlay = document.getElementById('mobileMenuOverlay');
  if (overlay) {
    overlay.classList.toggle('open');
  }
}

function closeMenu() {
  const overlay = document.getElementById('mobileMenuOverlay');
  if (overlay) {
    overlay.classList.remove('open');
  }
}

// Configuration
const WORKER_URL = 'https://portfolio-chat.bhargavramkrishna.workers.dev';
const LINKEDIN_URL = 'https://www.linkedin.com/in/bhargav-rama-krishna-chitrala-1b36a2189';
const MAX_QUESTIONS = 20;
const HISTORY_LENGTH = 6;
const DEBOUNCE_DELAY = 1000;

// State
let conversationHistory = [];
let isSending = false;
let lastSendTime = 0;

// Initialize question count
function initializeQuestionCount() {
  const count = localStorage.getItem('chatQuestionsUsed');
  if (count === null) {
    localStorage.setItem('chatQuestionsUsed', '0');
    updateQuestionDisplay();
  } else {
    updateQuestionDisplay();
  }
}

// Update question count display
function updateQuestionDisplay() {
  const used = parseInt(localStorage.getItem('chatQuestionsUsed') || '0');
  const remaining = MAX_QUESTIONS - used;
  const counter = document.getElementById('questionCounter');
  
  if (counter) {
    if (remaining > 0) {
      counter.textContent = `${remaining} questions remaining`;
      counter.style.color = '#666';
    } else {
      counter.textContent = '0 questions remaining';
      counter.style.color = '#e74c3c';
    }
  }
}

// Check if question limit reached
function isLimitReached() {
  const used = parseInt(localStorage.getItem('chatQuestionsUsed') || '0');
  return used >= MAX_QUESTIONS;
}

// Show limit reached message
function showLimitReached() {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'chat-msg ai';
  div.innerHTML = `
    <div class="chat-avatar">AI</div>
    <div class="chat-bubble">
      <p>You've used all ${MAX_QUESTIONS} questions! 🎉</p>
      <p>Connect with Krishna directly on LinkedIn for more conversation:</p>
      <a href="${LINKEDIN_URL}" target="_blank" class="linkedin-button" style="
        display: inline-block;
        margin-top: 10px;
        padding: 10px 20px;
        background-color: #0077b5;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
      ">Open LinkedIn</a>
    </div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  
  // Disable input
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendButton');
  if (input) input.disabled = true;
  if (sendBtn) sendBtn.disabled = true;
}

// Add message to chat
function addMessage(text, role) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.innerHTML = `<div class="chat-avatar">${role === 'user' ? 'YOU' : 'AI'}</div><div class="chat-bubble">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  
  // Store in history
  conversationHistory.push({ role, text });
  
  // Keep only last N messages
  if (conversationHistory.length > HISTORY_LENGTH * 2) {
    conversationHistory = conversationHistory.slice(-HISTORY_LENGTH * 2);
  }
}

// Show typing indicator
function showTyping() {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'chat-msg ai';
  div.id = 'typingIndicator';
  div.innerHTML = `<div class="chat-avatar">AI</div><div class="chat-typing"><span></span><span></span><span></span></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

// Remove typing indicator
function removeTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

// Get last N messages for history
function getMessageHistory(n = HISTORY_LENGTH) {
  return conversationHistory.slice(-n).map(msg => ({
    role: msg.role,
    content: msg.text
  }));
}

// Call Cloudflare Worker API
async function callWorkerAPI(userMessage) {
  try {
    const payload = {
      message: userMessage,
      history: getMessageHistory(HISTORY_LENGTH)
    };
    
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.answer || 'I couldn\'t generate a response. Please try again.';
  } catch (error) {
    console.error('Chat API error:', error);
    return 'Sorry, I encountered an error connecting to my AI brain. Please try again in a moment!';
  }
}

// Handle chat submission
async function handleChat() {
  // Check debounce
  const now = Date.now();
  if (now - lastSendTime < DEBOUNCE_DELAY) {
    return;
  }
  
  if (isSending) return;
  
  const input = document.getElementById('chatInput');
  const val = input.value.trim();
  
  // Prevent empty messages
  if (!val) {
    return;
  }
  
  // Check question limit
  if (isLimitReached()) {
    showLimitReached();
    return;
  }
  
  // Update state
  isSending = true;
  lastSendTime = now;
  input.disabled = true;
  
  try {
    // Add user message
    addMessage(val, 'user');
    input.value = '';
    
    // Show typing indicator
    showTyping();
    
    // Call API
    const response = await callWorkerAPI(val);
    
    // Remove typing and add response
    removeTyping();
    addMessage(response, 'ai');
    
    // Increment question count
    const used = parseInt(localStorage.getItem('chatQuestionsUsed') || '0');
    localStorage.setItem('chatQuestionsUsed', (used + 1).toString());
    updateQuestionDisplay();
    
    // Check if limit reached
    if (isLimitReached()) {
      setTimeout(showLimitReached, 500);
    }
  } catch (error) {
    console.error('Chat error:', error);
    removeTyping();
    addMessage('Sorry, something went wrong. Please try again!', 'ai');
  } finally {
    isSending = false;
    input.disabled = false;
    input.focus();
  }
}

// Send suggestion
function sendSuggestion(btn) {
  const input = document.getElementById('chatInput');
  input.value = btn.textContent;
  handleChat();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeQuestionCount();
  
  const input = document.getElementById('chatInput');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleChat();
      }
    });
  }
});
