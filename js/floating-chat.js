function updateChatUnreadDot() {
  const button = document.getElementById('floatingChatButton');
  const dot = button ? button.querySelector('.chat-unread-dot') : null;
  if (!dot) return;
  const opened = localStorage.getItem('chatOpened') === 'true';
  dot.style.display = opened ? 'none' : 'block';
}

function openFloatingChat() {
  const panel = document.getElementById('floatingChatPanel');
  const button = document.getElementById('floatingChatButton');
  if (!panel) return;
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  if (button) {
    button.setAttribute('aria-expanded', 'true');
    localStorage.setItem('chatOpened', 'true');
    updateChatUnreadDot();
  }
  const input = document.getElementById('chatInput');
  if (input) input.focus();
}

function closeFloatingChat() {
  const panel = document.getElementById('floatingChatPanel');
  const button = document.getElementById('floatingChatButton');
  if (!panel) return;
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  if (button) button.setAttribute('aria-expanded', 'false');
}

function toggleFloatingChat() {
  const panel = document.getElementById('floatingChatPanel');
  if (!panel) return;
  if (panel.classList.contains('open')) {
    closeFloatingChat();
  } else {
    openFloatingChat();
  }
}

function hideFloatingChatSuggestions() {
  const suggestions = document.getElementById('floatingChatSuggestions');
  if (suggestions) {
    suggestions.style.display = 'none';
  }
}

function ensureChatWidgetHash() {
  if (window.location.hash === '#chat') {
    openFloatingChat();
  }
}

function initFloatingChat() {
  const button = document.getElementById('floatingChatButton');
  const closeButton = document.getElementById('floatingChatClose');
  const sendButton = document.getElementById('sendButton');
  const input = document.getElementById('chatInput');
  const suggestions = document.getElementById('floatingChatSuggestions');

  if (button) {
    button.addEventListener('click', toggleFloatingChat);
  }

  if (closeButton) {
    closeButton.addEventListener('click', closeFloatingChat);
  }

  if (sendButton) {
    sendButton.addEventListener('click', () => {
      hideFloatingChatSuggestions();
      handleChat();
    });
  }

  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        hideFloatingChatSuggestions();
      }
    });
  }

  if (suggestions) {
    suggestions.addEventListener('click', e => {
      if (e.target && e.target.matches('.chat-suggest')) {
        hideFloatingChatSuggestions();
      }
    });
  }

  updateChatUnreadDot();
  ensureChatWidgetHash();
  window.addEventListener('hashchange', ensureChatWidgetHash);
}

document.addEventListener('DOMContentLoaded', initFloatingChat);
