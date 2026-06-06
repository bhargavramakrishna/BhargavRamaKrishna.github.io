(function () {
  const overlay = document.getElementById('blogModalOverlay');
  const modalContent = document.getElementById('blogModalContent');
  const closeBtn = document.getElementById('blogModalClose');

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderContent(blocks) {
    return blocks.map(block => {
      switch (block.type) {
        case 'intro':
          return `<p class="bm-intro">${block.text}</p>`;
        case 'heading':
          return `<h3 class="bm-heading">${block.text}</h3>`;
        case 'paragraph':
          return `<p class="bm-paragraph">${block.text}</p>`;
        case 'list':
          return `<ul class="bm-list">${block.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
        case 'code':
          return `<pre class="bm-code"><code>${escapeHtml(block.text)}</code></pre>`;
        case 'image':
          return `<img class="bm-image" src="${block.src}" alt="${block.alt || ''}">`;
        default:
          return '';
      }
    }).join('');
  }

  function openModal(post) {
    modalContent.innerHTML = `
      <div class="bm-meta">
        <span class="bm-category">${post.category}</span>
        <span class="bm-date">${post.date}</span>
        <span class="bm-readtime">${post.readTime}</span>
      </div>
      <h2 class="bm-title">${post.title}</h2>
      <p class="bm-subtitle">${post.subtitle}</p>
      <div class="bm-divider"></div>
      <div class="bm-body">${renderContent(post.content)}</div>
    `;
    overlay.classList.add('open');
    overlay.querySelector('.blog-modal').scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  fetch('../data/blog.json')
    .then(r => r.json())
    .then(data => {
      const grid = document.querySelector('.blog-grid');
      if (!grid) return;
      grid.innerHTML = '';
      data.posts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.innerHTML = `
          <div class="blog-card-category">${post.category}</div>
          <div class="blog-card-title">${post.title}</div>
          <div class="blog-card-text">${post.subtitle}</div>
          <div class="blog-card-footer">
            <span class="blog-card-date">${post.date}</span>
            <span class="blog-card-readtime">${post.readTime}</span>
          </div>
        `;
        card.addEventListener('click', () => openModal(post));
        card.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') openModal(post);
        });
        grid.appendChild(card);
      });
    })
    .catch(err => console.error('Failed to load blog posts:', err));
})();
