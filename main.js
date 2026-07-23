document.addEventListener('DOMContentLoaded', function () {
lucide.createIcons();

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2200);
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (scrollTop / docHeight) * 100;
  document.getElementById('scroll-progress').style.width = pct + '%';
});

window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(l => {
    l.classList.remove('active');
    if (l.getAttribute('href') === '#' + current) l.classList.add('active');
  });
});

const navToggler = document.getElementById('navToggler');
const navMenu = document.getElementById('navMenu');
const navBackdrop = document.getElementById('navBackdrop');

function openNavMenu() {
  navMenu.classList.add('open');
  navBackdrop.classList.add('open');
  navToggler.classList.add('active');
  navToggler.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeNavMenu() {
  navMenu.classList.remove('open');
  navBackdrop.classList.remove('open');
  navToggler.classList.remove('active');
  navToggler.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

navToggler.addEventListener('click', () => {
  if (navMenu.classList.contains('open')) closeNavMenu();
  else openNavMenu();
});

navBackdrop.addEventListener('click', closeNavMenu);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) closeNavMenu();
});

navLinks.forEach(l => l.addEventListener('click', closeNavMenu));

window.addEventListener('resize', () => {
  if (window.innerWidth >= 992 && navMenu.classList.contains('open')) closeNavMenu();
});

const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) backTop.classList.add('show');
  else backTop.classList.remove('show');
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const typedEl = document.getElementById('typed-text');
const phrases = ['Front-End Developer', 'UI/UX Enthusiast', 'React Developer', 'Creative Coder'];
let phraseIdx = 0, charIdx = 0, deleting = false;

function type() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    typedEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typedEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 50 : 80);
}
setTimeout(type, 1000);

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = Math.random() * 2 + 0.5;
    this.dx = (Math.random() - 0.5) * 0.4;
    this.dy = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 166, 147, ${this.alpha})`;
    ctx.fill();
  }
  update() {
    this.x += this.dx; this.y += this.dy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    this.draw();
  }
}

const particleCount = window.innerWidth < 768 ? 35 : 55;
for (let i = 0; i < particleCount; i++) particles.push(new Particle());

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 166, 147, ${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => p.update());
  connectParticles();
  requestAnimationFrame(animateParticles);
}
if (!prefersReducedMotion) animateParticles();

const hero = document.getElementById('hero');
hero.addEventListener('mousemove', e => {
  const rect = hero.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  hero.style.background = `radial-gradient(ellipse at ${x}% ${y}%, rgba(0, 166, 147,0.08) 0%, transparent 50%), var(--gradient-hero)`;
});

const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

const counters = document.querySelectorAll('.stat-number[data-count]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      let count = 0;
      const step = target / 60;
      const interval = setInterval(() => {
        count += step;
        if (count >= target) { el.textContent = target + '+'; clearInterval(interval); }
        else el.textContent = Math.floor(count);
      }, 16);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

const skillBars = document.querySelectorAll('.skill-bar');
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 200);
      skillObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });
skillBars.forEach(b => skillObserver.observe(b));

const circles = document.querySelectorAll('.circle-fill');
const circleObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const circle = entry.target;
      const pct = parseInt(circle.dataset.pct);
      const circumference = 283;
      const offset = circumference - (pct / 100) * circumference;
      setTimeout(() => { circle.style.strokeDashoffset = offset; }, 300);
      circleObserver.unobserve(circle);
    }
  });
}, { threshold: 0.3 });
circles.forEach(c => circleObserver.observe(c));

const filterBtns = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectItems.forEach(item => {
      const tags = item.dataset.tags;
      if (filter === 'all' || tags.includes(filter)) {
        item.style.opacity = '0'; item.style.transform = 'scale(0.9)';
        item.style.display = 'block';
        setTimeout(() => {
          item.style.transition = 'all 0.4s ease';
          item.style.opacity = '1'; item.style.transform = 'scale(1)';
        }, 50);
      } else {
        item.style.opacity = '0'; item.style.transform = 'scale(0.9)';
        setTimeout(() => { item.style.display = 'none'; }, 400);
      }
    });
  });
});

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotY = ((x - cx) / cx) * 8;
    const rotX = -((y - cy) / cy) * 8;
    card.querySelector('.project-card-inner').style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.querySelector('.project-card-inner').style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  });
});

document.querySelectorAll('.btn-primary-custom, .btn-outline-custom').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('formName').value.trim();
  const email = document.getElementById('formEmail').value.trim();
  const subject = document.getElementById('formSubject').value.trim();
  const msg = document.getElementById('formMsg').value.trim();
  const successEl = document.getElementById('formSuccess');
  const errorEl = document.getElementById('formError');
  successEl.classList.remove('show'); errorEl.classList.remove('show');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !emailRegex.test(email) || !subject || !msg) {
    errorEl.classList.add('show');
    return;
  }
  const submitBtn = this.querySelector('[type="submit"]');
  submitBtn.innerHTML = '<i data-lucide="loader" class="me-2 icon-spin" aria-hidden="true"></i>Sending...';
  lucide.createIcons();
  submitBtn.disabled = true;
  setTimeout(() => {
    successEl.classList.add('show');
    submitBtn.innerHTML = '<i data-lucide="send" class="me-2" aria-hidden="true"></i>Send Message';
    lucide.createIcons();
    submitBtn.disabled = false;
    this.reset();
  }, 1500);
});

const themeBtn = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  const el = document.getElementById('theme-icon');
  el.outerHTML = `<i data-lucide="${theme === 'dark' ? 'moon' : 'sun'}" id="theme-icon" aria-hidden="true"></i>`;
  lucide.createIcons();
}

const certData = {
  1: { icon: 'award', title: 'Responsive Web Design', issuer: 'freeCodeCamp', img: 'images/certificates/responsive-web-design.jpg' },
  2: { icon: 'zap', title: 'JavaScript: The Complete Guide 2024', issuer: 'Udemy', img: 'images/certificates/javascript-complete-guide.jpg' },
  3: { icon: 'graduation-cap', title: 'Front-End Developer Professional Certificate', issuer: 'Coursera — Meta', img: 'images/certificates/meta-frontend-professional.jpg' },
  4: { icon: 'component', title: 'Learn React for Free', issuer: 'Scrimba', img: 'images/certificates/react-scrimba.jpg' },
  5: { icon: 'sparkles', title: 'UX Design Professional Certificate', issuer: 'Google', img: 'images/certificates/ux-design-google.jpg' }
};

window.openCertModal = function (id) {
  const data = certData[id];
  const content = document.getElementById('certModalContent');
  content.innerHTML = '';
  const img = document.createElement('img');
  img.src = data.img;
  img.alt = data.title;
  img.className = 'cert-modal-img';
  img.loading = 'lazy';
  img.onerror = function () {
    content.innerHTML = `<i data-lucide="${data.icon}" aria-hidden="true"></i>`;
    lucide.createIcons();
  };
  content.appendChild(img);
  document.getElementById('certModalTitle').textContent = data.title;
  document.getElementById('certModalIssuer').textContent = data.issuer;
  new bootstrap.Modal(document.getElementById('certModal')).show();
};

window.openImageLightbox = function (src, caption) {
  const img = document.getElementById('lightboxImg');
  img.src = src;
  img.alt = caption ? caption + ' preview' : 'Project preview';
  document.getElementById('lightboxCaption').textContent = caption || '';
  new bootstrap.Modal(document.getElementById('imageLightbox')).show();
};

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      closeNavMenu();
    }
  });
});
});