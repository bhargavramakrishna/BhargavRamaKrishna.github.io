(function() {
const WORKER_URL = 'https://portfolio-chat.bhargavramkrishna.workers.dev';
const HISTORY_LENGTH = 6;
let termHistory = [];
let termSending = false;

function termAddUserLine(text) {
  const msgs = document.getElementById('terminalMessages');
  const div = document.createElement('div');
  div.className = 'term-line term-user-line';
  div.innerHTML = '<span class="term-prompt-user">krishna</span><span class="term-prompt-at">@</span><span class="term-prompt-host">portfolio</span> <span class="term-prompt-path">~ $</span> <span class="term-user-msg">' + text + '</span>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  termHistory.push({ role: 'user', content: text });
  if (termHistory.length > HISTORY_LENGTH * 2) termHistory = termHistory.slice(-HISTORY_LENGTH * 2);
}

function termAddAILine(text) {
  const msgs = document.getElementById('terminalMessages');
  const div = document.createElement('div');
  div.className = 'term-line term-ai-line';
  div.innerHTML = '<span class="term-muted">▸</span> <span class="term-text">' + text + '</span>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  termHistory.push({ role: 'assistant', content: text });
  if (termHistory.length > HISTORY_LENGTH * 2) termHistory = termHistory.slice(-HISTORY_LENGTH * 2);
}

function termShowTyping() {
  const msgs = document.getElementById('terminalMessages');
  const div = document.createElement('div');
  div.className = 'term-line term-typing';
  div.id = 'termTyping';
  div.innerHTML = '<span class="term-muted">▸</span> <span></span><span></span><span></span>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function termRemoveTyping() {
  const el = document.getElementById('termTyping');
  if (el) el.remove();
}

function getTermHistory() {
  return termHistory.slice(-HISTORY_LENGTH).map(msg => ({
    role: msg.role === 'ai' ? 'assistant' : msg.role,
    content: msg.content
  }));
}

async function termSend(text) {
  if (termSending || !text.trim()) return;
  termSending = true;
  const input = document.getElementById('terminalInput');
  input.disabled = true;
  termAddUserLine(text);
  termShowTyping();
  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: getTermHistory() })
    });
    const data = await res.json();
    termRemoveTyping();
    termAddAILine(data.answer || 'Could not generate a response.');
  } catch (e) {
    termRemoveTyping();
    termAddAILine('Connection error. Try again.');
  }
  termSending = false;
  input.disabled = false;
  input.value = '';
  input.focus();
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('terminalInput');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        termSend(input.value);
      }
    });
  }

  document.addEventListener('click', e => {
    if (e.target.classList.contains('term-cmd-hint')) {
      termSend(e.target.textContent);
    }
  });

  const header = document.querySelector('.terminal-header');
  if (header) {
    header.addEventListener('click', () => {
      document.querySelector('.terminal-section').classList.toggle('collapsed');
    });
  }

  const mobileBtn = document.getElementById('terminalMobileBtn');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      const terminal = document.querySelector('.terminal-section');
      terminal.classList.toggle('mobile-open');
      if (terminal.classList.contains('mobile-open')) {
        document.getElementById('terminalInput').focus();
      }
    });
  }
});
})();
