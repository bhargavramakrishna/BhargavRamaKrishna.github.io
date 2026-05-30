const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const COLORS = ['rgba(0,255,224,', 'rgba(0,184,255,', 'rgba(123,92,255,'];

class Particle {
  constructor() { this.reset(true); }
  reset(init) {
    this.x = Math.random() * W;
    this.y = init ? Math.random() * H : H + 10;
    this.size = Math.random() * 1.8 + 0.4;
    this.speedX = (Math.random() - 0.5) * 0.35;
    this.speedY = -(Math.random() * 0.5 + 0.15);
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.pulse = Math.random() * Math.PI * 2;
    this.pulseSpeed = Math.random() * 0.02 + 0.005;
    this.twinkle = Math.random() * 0.3 + 0.7;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.pulse += this.pulseSpeed;
    this.twinkle = 0.7 + Math.sin(this.pulse) * 0.3;
    if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset(false);
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color + (this.opacity * this.twinkle) + ')';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
    const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
    grd.addColorStop(0, this.color + (this.opacity * 0.25 * this.twinkle) + ')');
    grd.addColorStop(1, this.color + '0)');
    ctx.fillStyle = grd;
    ctx.fill();
  }
}

for (let i = 0; i < 130; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,255,224,${0.04 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}
animate();

// CURSOR
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
