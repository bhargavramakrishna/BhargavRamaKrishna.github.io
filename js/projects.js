let allProjects = [];

function renderHero() {
  const h = CONTENT.hero;
  document.getElementById('heroAvailability').textContent = h.availability;
  document.getElementById('heroName').innerHTML =
    `${h.firstName}<br><span class="hero-name-outline">${h.lastName}</span>`;
  document.getElementById('heroRole').innerHTML =
    `// <em>${h.role}</em> · ${h.degree}`;
  document.getElementById('heroLocation').textContent = h.location;
  document.getElementById('heroBtns').innerHTML = h.buttons.map(b =>
    `<a href="${b.href}" class="btn${b.style === 'ghost' ? ' btn-ghost' : ''}"${b.target ? ` target="${b.target}"` : ''}>${b.text}</a>`
  ).join('');
}

function renderAbout() {
  const leftEl = document.getElementById('aboutLeft');
  if (!leftEl) return;
  const a = CONTENT.about;
  const statsHTML = a.stats.map(s => `
    <div class="about-stat">
      <div class="about-stat-num">${s.num}</div>
      <div class="about-stat-label">${s.label}</div>
    </div>`).join('');
  const eduHTML = a.education.map(e => `
    <div class="about-edu">
      <div class="about-edu-title">${e.school}</div>
      <div class="about-edu-sub">${e.degree}</div>
      <div class="about-edu-detail">${e.detail}</div>
    </div>`).join('');
  leftEl.className = 'about-stats';
  leftEl.innerHTML = statsHTML + eduHTML;
  const aboutText = document.getElementById('aboutText');
  if (aboutText) {
    aboutText.innerHTML = a.paragraphs.map(p => `<p>${p}</p>`).join('');
  }
}

function renderSkills() {
  const container = document.getElementById('skillsContainer');
  if (!container) return;
  container.innerHTML = CONTENT.skills.map(cat => `
    <div>
      <div class="skill-category-label">${cat.category}</div>
      <div class="skills-grid">${cat.items.map(s => `<div class="skill-tag">${s}</div>`).join('')}</div>
    </div>`).join('');
}

function renderExperience() {
  const container = document.getElementById('expList');
  if (!container) return;
  container.innerHTML = CONTENT.experience.map(e => `
    <div class="exp-item">
      <div class="exp-meta">
        <div class="exp-date">${e.date}</div>
        <div class="exp-company">${e.company}</div>
        <div class="exp-type">${e.type}</div>
      </div>
      <div>
        <div class="exp-role">${e.role}</div>
        <ul class="exp-desc">${e.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
      </div>
    </div>`).join('');
}

function renderCerts() {
  const container = document.getElementById('certsGrid');
  if (!container) return;
  container.innerHTML = CONTENT.certs.map(c => `
    <div class="cert-card">
      <div class="cert-issuer">${c.issuer}</div>
      <div class="cert-name">${c.name}</div>
      <div class="cert-date">${c.date}</div>
    </div>`).join('');
}

function projectThumb(p) {
  if (p.image) {
    return `<img src="${p.image}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;">`;
  }
  return p.title.slice(0, 3).toUpperCase();
}

async function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  try {
    const response = await fetch('data/projects.json');
    const text = await response.text();
    const cleaned = text.split('\n').filter(l => !l.trim().startsWith('//')).join('\n');
    allProjects = JSON.parse(cleaned);
    grid.innerHTML = allProjects.map((p, i) => `
      <div class="project-card" onclick="openModal(${i})">
        <div class="project-arrow">↗</div>
        <div class="project-thumb">
          <div class="project-thumb-pattern"></div>
          <div class="project-thumb-icon">${projectThumb(p)}</div>
        </div>
        <div class="project-body">
          <div class="project-tags">${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>
          <div class="project-title">${p.title}</div>
          <div class="project-desc">${p.desc}</div>
        </div>
      </div>`).join('');
  } catch (e) {
    console.error('Failed to load projects:', e);
  }
}

function renderContact() {
  const c = CONTENT.contact;
  document.getElementById('contactSub').textContent = c.sub;
  document.getElementById('contactLinks').innerHTML = `
    <a href="${c.linkedin}" target="_blank" class="contact-link">◈ LINKEDIN</a>
    <a href="mailto:${c.email}" class="contact-link">✉ EMAIL</a>
    <a href="${c.github}" class="contact-link">⟳ GITHUB</a>`;
}

function openModal(i) {
  const p = allProjects[i];
  const modalIcon = document.getElementById('modalIcon');
  if (p.image) {
    modalIcon.innerHTML = `<img src="${p.image}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;">`;
  } else {
    modalIcon.textContent = p.title.slice(0, 3).toUpperCase();
  }
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalDesc').innerHTML = p.fullDesc
    .split('\n\n')
    .map(para => `<p style="margin-bottom:1rem">${para}</p>`)
    .join('');
  document.getElementById('modalTags').innerHTML =
    p.tags.map(t => `<span class="modal-tag">${t}</span>`).join('');
  let links = '';
  if (p.github) links += `<a href="${p.github}" target="_blank" class="btn btn-sm">↗ GitHub</a>`;
  if (p.live) links += `<a href="${p.live}" target="_blank" class="btn btn-sm btn-ghost">◈ Live Demo</a>`;
  if (!links) links = `<span style="font-family:var(--mono);font-size:0.65rem;color:var(--muted);letter-spacing:1px;">Private / Academic Project</span>`;
  document.getElementById('modalLinks').innerHTML = links;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modalOverlay') || e.currentTarget?.classList?.contains('modal-close')) {
    document.getElementById('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal({ target: document.getElementById('modalOverlay') });
});

document.addEventListener('DOMContentLoaded', () => {
  renderHero();
  renderAbout();
  renderSkills();
  renderExperience();
  renderCerts();
  renderProjects();
  renderContact();
});
