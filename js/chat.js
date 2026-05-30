function getAnswer(q) {
  q = q.toLowerCase();
  const f = CONTENT.faqs;
  if (q.includes('educat') || q.includes('degree') || q.includes('university') || q.includes('kingston') || q.includes('msc') || q.includes('study')) return f.education;
  if (q.includes('project') || q.includes('built') || q.includes('work on') || q.includes('portfolio')) return f.projects;
  if (q.includes('machine learn') || q.includes(' ml') || q.includes('neural') || q.includes('deep learn') || q.includes('pytorch') || q.includes('model')) return f.ml;
  if (q.includes(' ai') || q.includes('artificial') || q.includes('llm') || q.includes('langchain') || q.includes('rag') || q.includes('hugging')) return f.ai;
  if (q.includes('hire') || q.includes('available') || q.includes('open to') || q.includes('looking') || q.includes('job') || q.includes('opportun')) return f.hire;
  if (q.includes('experience') || q.includes('work') || q.includes('job') || q.includes('role') || q.includes('company')) return f.experience;
  if (q.includes('game') || q.includes('unity') || q.includes('unreal') || q.includes('c#') || q.includes('c++')) return f.games;
  if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('language') || q.includes('tool') || q.includes('python') || q.includes('fastapi')) return f.skills;
  if (q.includes('locat') || q.includes('where') || q.includes('based') || q.includes('country') || q.includes('uk') || q.includes('england')) return f.location;
  if (q.includes('cert') || q.includes('qualif') || q.includes('course')) return f.certs;
  return f.default;
}

function addMessage(text, role) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.innerHTML = `<div class="chat-avatar">${role === 'user' ? 'YOU' : 'AI'}</div><div class="chat-bubble">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'chat-msg';
  div.id = 'typingIndicator';
  div.innerHTML = `<div class="chat-avatar">AI</div><div class="chat-typing"><span></span><span></span><span></span></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function handleChat() {
  const input = document.getElementById('chatInput');
  const val = input.value.trim();
  if (!val) return;
  addMessage(val, 'user');
  input.value = '';
  showTyping();
  setTimeout(() => {
    removeTyping();
    addMessage(getAnswer(val), 'ai');
  }, 800);
}

function sendSuggestion(btn) {
  addMessage(btn.textContent, 'user');
  showTyping();
  setTimeout(() => {
    removeTyping();
    addMessage(getAnswer(btn.textContent), 'ai');
  }, 800);
}

document.getElementById('chatInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleChat();
});
