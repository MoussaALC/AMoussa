/* ============================================
   PORTFOLIO MOUSSA ALLOUACHE — script.js
   Animations, interactions, canvas BG
   ============================================ */

// ============ CANVAS PARTICULES ============
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  const PARTICLE_COUNT = 70;
  const particles = [];

  const COLORS = [
    'rgba(0, 229, 255,',
    'rgba(168, 85, 247,',
    'rgba(244, 114, 182,',
  ];

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    const MAX_DIST = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });
})();

// ============ NAVBAR — SCROLL & BURGER ============
const navbar  = document.getElementById('navbar');
const burger  = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
const allLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveLink();
});

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Fermer le menu mobile au clic sur un lien
allLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ============ ACTIVE LINK AU SCROLL ============
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';

  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });

  allLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === current) link.classList.add('active');
  });
}

// ============ INTERSECTION OBSERVER — APPARITION CARTES ============
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || 0);

      setTimeout(() => {
        el.classList.add('visible');

        // Animer les barres de compétences si présentes
        const fills = el.querySelectorAll('.skill-fill');
        fills.forEach(fill => {
          const target = fill.dataset.width;
          setTimeout(() => {
            fill.style.width = target + '%';
          }, 200);
        });
      }, delay);

      observer.unobserve(el);
    }
  });
}, observerOptions);

// Observer tous les éléments animés
document.querySelectorAll(
  '.card, .veille-card, .certif-card'
).forEach(el => observer.observe(el));

// ============ FORMULAIRE CONTACT ============
const form     = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showFeedback('Merci de remplir tous les champs.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showFeedback('Adresse email invalide.', 'error');
    return;
  }

  // Simulation envoi (remplacer par appel API réel)
  const btn = form.querySelector('.submit-btn');
  btn.textContent = 'Envoi en cours...';
  btn.disabled = true;

  setTimeout(() => {
    showFeedback(`✅ Merci ${name} ! Votre message a bien été envoyé.`, 'success');
    form.reset();
    btn.innerHTML = 'Envoyer <i class="fas fa-paper-plane"></i>';
    btn.disabled = false;
  }, 1500);
});

function showFeedback(msg, type) {
  feedback.textContent = msg;
  feedback.style.color = type === 'success' ? '#22c55e' : '#f87171';
  feedback.style.opacity = '1';
  setTimeout(() => {
    feedback.style.opacity = '0';
    feedback.style.transition = 'opacity 0.5s';
  }, 4000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============ SMOOTH SCROLL ANCRES ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = document.getElementById('navbar').offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============ CURSOR GLOW EFFECT ============
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,229,255,0.04), transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();

// ============ TYPING EFFECT HERO TAG ============
(function typingEffect() {
  const tag = document.querySelector('.hero-tag');
  if (!tag) return;

  const text = tag.textContent;
  tag.textContent = '';
  tag.style.opacity = '1';
  tag.style.animation = 'none';

  let i = 0;
  const interval = setInterval(() => {
    tag.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 55);
})();

// ============ INIT AU CHARGEMENT ============
window.addEventListener('DOMContentLoaded', () => {
  updateActiveLink();
});
