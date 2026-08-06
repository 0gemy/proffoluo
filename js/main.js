
document.addEventListener('touchmove', function (e) {
  if (e.touches && e.touches.length > 1) e.preventDefault();
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function (e) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) e.preventDefault();
  lastTouchEnd = now;
}, { passive: false });

document.addEventListener('gesturestart', function (e) { e.preventDefault(); });

document.addEventListener('DOMContentLoaded', function () {

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }


  const navMenuDesktopList = document.querySelector('#navMenuDesktop .navbar-nav');
  const navMenuMobile = document.getElementById('navMenu');
  if (navMenuDesktopList && navMenuMobile) {
    navMenuMobile.appendChild(navMenuDesktopList.cloneNode(true));
  }

  
  let loaderHidden = false;
  function hideLoader() {
    if (loaderHidden) return;
    loaderHidden = true;
    const loaderEl = document.getElementById('loader');
    if (loaderEl) loaderEl.classList.add('hidden');
  }
  window.addEventListener('load', () => setTimeout(hideLoader, 600));
  setTimeout(hideLoader, 3000);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

 
  const scrollProgressEl = document.getElementById('scroll-progress');
  const navbarEl = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  let scrollTicking = false;
  function handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProgressEl) {
      scrollProgressEl.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    }

    if (navbarEl) {
      if (scrollTop > 60) navbarEl.classList.add('scrolled');
      else navbarEl.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(s => {
      if (scrollTop >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === '#' + current) l.classList.add('active');
    });

    scrollTicking = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(handleScroll);
      scrollTicking = true;
    }
  }, { passive: true });
  handleScroll();


  const navToggler = document.getElementById('navToggler');
  const navMenu = document.getElementById('navMenu');
  const navBackdrop = document.getElementById('navBackdrop');

  function openNavMenu() {
    if (!navMenu || !navBackdrop || !navToggler) return;
    navMenu.classList.add('open');
    navBackdrop.classList.add('open');
    navToggler.classList.add('active');
    navToggler.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNavMenu() {
    if (!navMenu || !navBackdrop || !navToggler) return;
    navMenu.classList.remove('open');
    navBackdrop.classList.remove('open');
    navToggler.classList.remove('active');
    navToggler.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navToggler) {
    navToggler.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('open')) closeNavMenu();
      else openNavMenu();
    });
  }

  if (navBackdrop) navBackdrop.addEventListener('click', closeNavMenu);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) closeNavMenu();
  });

  navLinks.forEach(l => l.addEventListener('click', closeNavMenu));

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992 && navMenu && navMenu.classList.contains('open')) closeNavMenu();
  });


  const backTop = document.getElementById('back-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) backTop.classList.add('show');
      else backTop.classList.remove('show');
    });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }


  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const phrases = ['Front-End Developer','React Developer'];
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
  }


  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
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

    let particlesRafId = null;
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => p.update());
      connectParticles();
      particlesRafId = requestAnimationFrame(animateParticles);
    }
    if (!prefersReducedMotion) animateParticles();

    document.addEventListener('visibilitychange', () => {
      if (prefersReducedMotion) return;
      if (document.hidden) {
        if (particlesRafId) cancelAnimationFrame(particlesRafId);
        particlesRafId = null;
      } else if (!particlesRafId) {
        animateParticles();
      }
    });
  }


  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.background = `radial-gradient(ellipse at ${x}% ${y}%, rgba(0, 166, 147,0.08) 0%, transparent 50%), var(--gradient-hero)`;
    });
  }


  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
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
        const tags = item.dataset.tags || '';
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
      const inner = card.querySelector('.project-card-inner');
      if (inner) inner.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      const inner = card.querySelector('.project-card-inner');
      if (inner) inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
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


  const toastContainer = document.createElement('div');
  toastContainer.className = 'custom-toast';
  toastContainer.id = 'customToast';
  toastContainer.innerHTML = `
    <div class="toast-icon" id="toastIcon"></div>
    <div class="toast-content">
      <div class="toast-title" id="toastTitle"></div>
      <div class="toast-desc" id="toastDesc"></div>
    </div>
    <button class="toast-close" id="toastCloseBtn" aria-label="Close Toast">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;
  document.body.appendChild(toastContainer);

  let toastTimeout;
  window.showToast = function(type, title, message) {
    clearTimeout(toastTimeout);
    const toast = document.getElementById('customToast');
    const icon = document.getElementById('toastIcon');
    const titleEl = document.getElementById('toastTitle');
    const descEl = document.getElementById('toastDesc');

    if (!toast || !icon || !titleEl || !descEl) return;

    toast.className = `custom-toast toast-${type} show`;
    titleEl.textContent = title;
    descEl.textContent = message;

    const toastIcons = {
      success: 'fa-solid fa-circle-check',
      error: 'fa-solid fa-circle-xmark',
      warning: 'fa-solid fa-triangle-exclamation',
      info: 'fa-solid fa-circle-info'
    };
    icon.innerHTML = `<i class="${toastIcons[type] || toastIcons.info}"></i>`;

    toastTimeout = setTimeout(() => {
      hideToast();
    }, 5000);
  };

  window.hideToast = function() {
    const toast = document.getElementById('customToast');
    if (toast) toast.classList.remove('show');
  };

  const toastCloseBtn = document.getElementById('toastCloseBtn');
  if (toastCloseBtn) {
    toastCloseBtn.addEventListener('click', hideToast);
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const successEl = document.getElementById("formSuccess");
      const errorEl = document.getElementById("formError");

      if (successEl) successEl.classList.remove("show");
      if (errorEl) errorEl.classList.remove("show");

  
      const formInputs = this.querySelectorAll('input[required], textarea[required]');
      let isValid = true;

      formInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
        }
      });

      if (!isValid) {
        showToast('warning', ' البيانات غير مكتملة', 'يرجى إدخال كافة البيانات المطلوبة قبل الإرسال.');
        return;
      }

      const submitBtn = this.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>جاري الإرسال...';
      }

      emailjs.sendForm(
        "service_u5ltalu",
        "template_0o21efa",
        this,
        "xHxXyRbMscR6-b2KY"
      )
      .then(() => {
        if (successEl) successEl.classList.add("show");
        showToast('success', 'تم الإرسال بنجاح!', 'تم إرسال رسالتك وسيتم الرد عليك في أقرب وقت.');
        this.reset();
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        if (errorEl) errorEl.classList.add("show");
        showToast('error', 'خطأ في الإرسال', 'حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة لاحقاً.');
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      });
    });
  }


  const themeBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    const el = document.getElementById('theme-icon');
    if (el && typeof lucide !== 'undefined' && lucide.createIcons) {
      el.outerHTML = `<i data-lucide="${theme === 'dark' ? 'moon' : 'sun'}" id="theme-icon" aria-hidden="true"></i>`;
      lucide.createIcons();
    }
  }


  window.openCertModal = function (cardEl) {
    const sourceImg = cardEl.querySelector('.cert-img-wrap img');
    const fallbackIcon = cardEl.querySelector('.cert-placeholder [data-lucide]');
    const fallbackIconName = fallbackIcon ? fallbackIcon.getAttribute('data-lucide') : 'award';
    const title = cardEl.querySelector('.cert-title')?.textContent.trim() || '';
    const issuer = cardEl.querySelector('.cert-issuer')?.textContent.trim() || '';
    const content = document.getElementById('certModalContent');
    if (!content) return;

    content.innerHTML = '';

    function showFallbackIcon() {
      content.innerHTML = `<i data-lucide="${fallbackIconName}" aria-hidden="true"></i>`;
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
      }
    }

    if (sourceImg && sourceImg.src) {
      const img = document.createElement('img');
      img.className = 'cert-modal-img';
      img.alt = sourceImg.alt || title;
      img.onerror = showFallbackIcon;
      img.src = sourceImg.src;
      content.appendChild(img);
    } else {
      showFallbackIcon();
    }

    const titleEl = document.getElementById('certModalTitle');
    const issuerEl = document.getElementById('certModalIssuer');
    if (titleEl) titleEl.textContent = title;
    if (issuerEl) issuerEl.textContent = issuer;

    const certModalEl = document.getElementById('certModal');
    if (certModalEl && typeof bootstrap !== 'undefined') {
      new bootstrap.Modal(certModalEl).show();
    }
  };


  window.openImageLightbox = function (triggerEl) {
    const sourceImg = triggerEl.querySelector('img');
    const img = document.getElementById('lightboxImg');
    const fallback = document.getElementById('lightboxFallback');
    const captionText = triggerEl.dataset.title || (sourceImg ? sourceImg.alt : '') || '';

    if (img && fallback) {
      img.onerror = function () {
        img.style.display = 'none';
        fallback.classList.add('show');
      };
      img.onload = function () {
        img.style.display = '';
        fallback.classList.remove('show');
      };

      if (sourceImg && sourceImg.src) {
        img.style.display = '';
        fallback.classList.remove('show');
        img.src = sourceImg.src;
        img.alt = sourceImg.alt || captionText;
      } else {
        img.removeAttribute('src');
        img.style.display = 'none';
        fallback.classList.add('show');
      }
    }

    const captionEl = document.getElementById('lightboxCaption');
    if (captionEl) captionEl.textContent = captionText;

    const lightboxEl = document.getElementById('imageLightbox');
    if (lightboxEl && typeof bootstrap !== 'undefined') {
      new bootstrap.Modal(lightboxEl).show();
    }
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
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
