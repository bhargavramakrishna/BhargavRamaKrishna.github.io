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
const MATCH_URL = 'https://portfolio-jd-matcher.bhargavramkrishna.workers.dev';
const LINKEDIN_URL = 'https://www.linkedin.com/in/bhargav-rama-krishna-chitrala-1b36a2189';
const HISTORY_LENGTH = 6;
const DEBOUNCE_DELAY = 1000;
const MIN_JOB_DESCRIPTION_LENGTH = 50;
const MAX_JOB_DESCRIPTION_LENGTH = 3000;

// State
let conversationHistory = [];
let isSending = false;
let lastSendTime = 0;

function getRobotAvatarSrc() {
  const btn = document.querySelector('#floatingChatButton img');
  return btn ? btn.getAttribute('src') : 'assets/images/robot.png';
}

function robotAvatarHTML() {
  return `<img src="${getRobotAvatarSrc()}" alt="AI" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
}


// Add message to chat
function addMessage(text, role, saveToHistory = true) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.innerHTML = `<div class="chat-avatar">${role === 'user' ? 'YOU' : robotAvatarHTML()}</div><div class="chat-bubble">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;

  if (saveToHistory) {
    conversationHistory.push({ role, content: text });
    if (conversationHistory.length > HISTORY_LENGTH * 2) {
      conversationHistory = conversationHistory.slice(-HISTORY_LENGTH * 2);
    }
  }
}

// Show typing indicator
function showTyping() {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'chat-msg ai';
  div.id = 'typingIndicator';
  div.innerHTML = `<div class="chat-avatar">${robotAvatarHTML()}</div><div class="chat-typing"><span></span><span></span><span></span></div>`;
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
    role: msg.role === 'ai' ? 'assistant' : 'user',
    content: msg.content
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
    return { answer: data.answer || 'I couldn\'t generate a response. Please try again.', isError: !data.answer };
  } catch (error) {
    console.error('Chat API error:', error);
    return { answer: 'Sorry, I encountered an error connecting to my AI brain. Please try again in a moment!', isError: true };
  }
}

async function callMatchAPI(jobDescription) {
  try {
    const response = await fetch(MATCH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobDescription }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Match API error:', error);
    throw error;
  }
}

function setMatchStatus(message, isError = false, includeRetry = false) {
  const status = document.getElementById('matchStatus');
  if (!status) return;
  status.style.color = isError ? '#dc2626' : '#0369a1';
  if (includeRetry) {
    status.innerHTML = `${message} <button class="match-retry" type="button">Retry</button>`;
    const retry = status.querySelector('.match-retry');
    if (retry) {
      retry.addEventListener('click', analyzeJobDescription);
    }
  } else {
    status.textContent = message;
  }
}

function clearMatchResults() {
  const results = document.getElementById('matchResults');
  if (results) results.innerHTML = '';
}

function createMatchCard(title, content, className) {
  const card = document.createElement('div');
  card.className = `match-card ${className}`;
  card.innerHTML = `<h3>${title}</h3>${content}`;
  return card;
}

function listMatchItems(items) {
  if (!items || items.length === 0) return '';
  return `<ul>${items.map(item => {
    if (typeof item === 'object' && item.skill) {
      return `<li><strong>${item.skill}</strong> — ${item.context}</li>`;
    }
    return `<li>${item}</li>`;
  }).join('')}</ul>`;
}

function renderMatchResults(data) {
  const results = document.getElementById('matchResults');
  if (!results) return;
  clearMatchResults();

  const strongItems = Array.isArray(data.strongMatches) ? data.strongMatches : [];
  const transferableItems = Array.isArray(data.transferable) ? data.transferable : [];
  const growthItems = Array.isArray(data.growthAreas) ? data.growthAreas : [];
  const summaryText = data.summary || 'Krishna brings a positive and adaptable mindset to every opportunity.';

  const hasAnySkills = strongItems.length || transferableItems.length || growthItems.length;

  if (!hasAnySkills) {
    results.appendChild(createMatchCard('💬 OVERALL SUMMARY', `<p>Looks like a unique role! Krishna is a fast learner and adapts quickly to new requirements.</p>`, 'match-summary'));
    return;
  }

  results.appendChild(createMatchCard('✅ STRONG MATCHES', listMatchItems(strongItems), 'match-strong'));
  results.appendChild(createMatchCard('⚡ TRANSFERABLE SKILLS', listMatchItems(transferableItems), 'match-transferable'));
  results.appendChild(createMatchCard('🚀 GROWTH AREAS', listMatchItems(growthItems), 'match-growth'));
  results.appendChild(createMatchCard('💬 OVERALL SUMMARY', `<p>${summaryText}</p>`, 'match-summary'));
}

function setMatchLoading(isLoading) {
  const button = document.getElementById('analyzeButton');
  if (button) {
    button.disabled = isLoading;
    button.textContent = isLoading ? 'SCANNING...' : 'ANALYZE ROLE →';
  }
  const status = document.getElementById('matchStatus');
  if (status) {
    if (isLoading) {
      status.textContent = 'Analyzing job description...';
      status.style.color = '#0369a1';
    } else {
      status.textContent = '';
    }
  }
}

async function analyzeJobDescription() {
  const textarea = document.getElementById('jobDescription');
  if (!textarea) return;

  const rawText = textarea.value.trim();
  if (!rawText) {
    setMatchStatus('Please paste a job description first!', true);
    clearMatchResults();
    return;
  }

  if (rawText.length < MIN_JOB_DESCRIPTION_LENGTH) {
    setMatchStatus('Please paste a more complete job description!', true);
    clearMatchResults();
    return;
  }

  const jobDescription = rawText.length > MAX_JOB_DESCRIPTION_LENGTH ? rawText.slice(0, MAX_JOB_DESCRIPTION_LENGTH) : rawText;

  setMatchLoading(true);
  clearMatchResults();

  try {
    const data = await callMatchAPI(jobDescription);
    renderMatchResults(data);
    setMatchStatus('Match analysis complete. Review the cards below.');
  } catch (error) {
    setMatchStatus('Something went wrong. Please try again.', true, true);
    clearMatchResults();
  } finally {
    setMatchLoading(false);
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
  
  const suggestions = document.getElementById('floatingChatSuggestions');
  if (suggestions) {
    suggestions.style.display = 'none';
  }

  const input = document.getElementById('chatInput');
  const val = input.value.trim();
  
  // Prevent empty messages
  if (!val) {
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
    const { answer, isError } = await callWorkerAPI(val);

    // Remove typing and add response
    removeTyping();
    addMessage(answer, 'ai', !isError);
    
  } catch (error) {
    console.error('Chat error:', error);
    removeTyping();
    addMessage('Sorry, something went wrong. Please try again!', 'ai', false);
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

  const suggestions = document.getElementById('floatingChatSuggestions');
  if (suggestions) {
    suggestions.style.display = 'none';
  }

  handleChat();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('chatInput');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleChat();
      }
    });
  }

  const sendButton = document.getElementById('sendButton');
  if (sendButton) {
    sendButton.addEventListener('click', handleChat);
  }

  const analyzeButton = document.getElementById('analyzeButton');
  if (analyzeButton) {
    analyzeButton.addEventListener('click', analyzeJobDescription);
  }

  const jobDescription = document.getElementById('jobDescription');
  if (jobDescription) {
    jobDescription.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        analyzeJobDescription();
      }
    });
  }
});
