/* ==========================================================================
   TEACHER LUPI — APP CONTROLLER
   Theme, scroll effects, service worker, toast system
   ========================================================================== */

(function () {
  'use strict';

  // ── Theme System ──────────────────────────────────────────────────────
  const ThemeManager = {
    STORAGE_KEY: 'tl-theme',

    init() {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
      }
      // If no saved preference, CSS handles prefers-color-scheme automatically
    },

    toggle() {
      const current = document.documentElement.getAttribute('data-theme');
      const isDark = current === 'dark' ||
        (!current && window.matchMedia('(prefers-color-scheme: dark)').matches);
      const next = isDark ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(this.STORAGE_KEY, next);
    }
  };

  // ── Scroll Effects ────────────────────────────────────────────────────
  const ScrollEffects = {
    header: null,
    progressFill: null,
    stickyCta: null,
    heroHeight: 0,

    init() {
      this.header = document.querySelector('.site-header');
      this.progressFill = document.querySelector('.scroll-progress__fill');
      this.stickyCta = document.querySelector('.sticky-cta');
      this.heroHeight = window.innerHeight;

      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
      this.onScroll();
    },

    onScroll() {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Header scroll state
      if (this.header) {
        this.header.classList.toggle('is-scrolled', scrollY > 60);
      }

      // Scroll progress bar
      if (this.progressFill && docHeight > 0) {
        const progress = Math.min((scrollY / docHeight) * 100, 100);
        this.progressFill.style.width = progress + '%';
      }

      // Sticky CTA visibility
      if (this.stickyCta) {
        this.stickyCta.classList.toggle('is-visible', scrollY > this.heroHeight);
      }
    }
  };

  // ── Scroll Reveal (Intersection Observer) — Bidirectional ──────────────
  const RevealObserver = {
    init() {
      if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.reveal, .reveal--scale, .reveal-stagger')
          .forEach(el => el.classList.add('is-visible'));
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      document.querySelectorAll('.reveal, .reveal--scale, .reveal-stagger')
        .forEach(el => observer.observe(el));
    }
  };

  // ── Mobile Menu ───────────────────────────────────────────────────────
  const MobileMenu = {
    overlay: null,

    init() {
      this.overlay = document.querySelector('.mobile-nav');
      const openBtn = document.querySelector('.header__mobile-btn');
      const closeBtn = document.querySelector('.mobile-nav__close');
      const links = document.querySelectorAll('.mobile-nav__links a');

      if (!this.overlay || !openBtn) return;

      openBtn.addEventListener('click', () => this.open());
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());
      links.forEach(link => link.addEventListener('click', () => this.close()));
    },

    open() {
      this.overlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    },

    close() {
      this.overlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  };

  // ── Toast System ──────────────────────────────────────────────────────
  const Toast = {
    container: null,

    init() {
      this.container = document.querySelector('.neo-toast-container');
    },

    show(message, icon) {
      if (!this.container) return;

      const toast = document.createElement('div');
      toast.className = 'neo-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');

      const iconSvg = icon || '';
      toast.innerHTML = iconSvg + '<span>' + message + '</span>';

      this.container.appendChild(toast);

      // Remove after animation completes
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 3200);
    }
  };

  // ── Modal System ──────────────────────────────────────────────────────
  const ModalSystem = {
    init() {
      const redirectModal = document.getElementById('redirectModal');
      const progress = document.getElementById('redirectProgress');

      // WhatsApp / external link interceptor
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href*="wa.me"], a[href*="cnpj.biz"]');
        if (!link) return;

        e.preventDefault();
        const href = link.getAttribute('href');

        if (!redirectModal || !progress) {
          window.open(href, '_blank');
          return;
        }

        // Update modal text
        const modalText = redirectModal.querySelector('.neo-modal__text');
        if (modalText) {
          if (href.includes('cnpj.biz')) {
            modalText.innerHTML = 'Redirecionando para consulta oficial do <strong>CNPJ</strong>.';
          } else {
            modalText.innerHTML = 'Conectando você com a <strong>Teacher Lupi</strong> no WhatsApp...';
          }
        }

        // Show redirect modal
        redirectModal.classList.add('is-active');
        progress.style.width = '0%';
        requestAnimationFrame(() => {
          progress.style.width = '100%';
        });

        // Toast notification
        Toast.show('Abrindo WhatsApp...');

        setTimeout(() => {
          window.open(href, '_blank');
          redirectModal.classList.remove('is-active');
          progress.style.width = '0%';
        }, 1800);
      });

      // Close modals on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          document.querySelectorAll('.neo-modal-overlay.is-active')
            .forEach(m => m.classList.remove('is-active'));
        }
      });

      // Close modal on backdrop click
      document.querySelectorAll('.neo-modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) overlay.classList.remove('is-active');
        });
      });

      // Close buttons
      document.querySelectorAll('.neo-modal__close, [data-modal-close]').forEach(btn => {
        btn.addEventListener('click', () => {
          btn.closest('.neo-modal-overlay')?.classList.remove('is-active');
        });
      });
    }
  };

  // ── Loading Screen ────────────────────────────────────────────────────
  const LoadingScreen = {
    init() {
      const screen = document.querySelector('.loading-screen');
      if (!screen) return;

      // Hide after a brief delay to show the branded loading
      window.addEventListener('load', () => {
        setTimeout(() => {
          screen.classList.add('is-hidden');
          // Remove from DOM after transition
          setTimeout(() => screen.remove(), 600);
        }, 800);
      });
    }
  };

  // ── Smooth Scroll ─────────────────────────────────────────────────────
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const targetId = anchor.getAttribute('href');
          if (targetId === '#') return;

          const target = document.querySelector(targetId);
          if (!target) return;

          e.preventDefault();
          const headerOffset = 100;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        });
      });
    }
  };

  // ── Premium Cursor ──────────────────────────────────────────────────
  const CursorManager = {
    init() {
      const dot = document.getElementById('cursorDot');
      const ring = document.getElementById('cursorRing');
      if (!dot || !ring) return;

      let mouseX = 0, mouseY = 0;
      let ringX = 0, ringY = 0;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
      });

      // Smooth ring follow
      const followRing = () => {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(followRing);
      };
      followRing();

      // Hover states
      const interactives = document.querySelectorAll('a, button, .neo-btn, .float-icon, .neo-accordion__trigger, .header__brand, .social-card, .skill-card, .booking-slot');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
          dot.classList.add('is-hover');
          ring.classList.add('is-hover');
        });
        el.addEventListener('mouseleave', () => {
          dot.classList.remove('is-hover');
          ring.classList.remove('is-hover');
        });
      });

      // Click feedback
      document.addEventListener('mousedown', () => {
        dot.classList.add('is-clicking');
        ring.classList.add('is-clicking');
      });
      document.addEventListener('mouseup', () => {
        dot.classList.remove('is-clicking');
        ring.classList.remove('is-clicking');
      });

      // Parallax for floating icons
      const floatIcons = document.querySelectorAll('.float-icon');
      document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.clientX) / 60;
        const y = (window.innerHeight / 2 - e.clientY) / 60;
        floatIcons.forEach(icon => {
          icon.style.marginLeft = `${x}px`;
          icon.style.marginTop = `${y}px`;
        });
      });
    }
  };

  // ── Counter Animation ──────────────────────────────────────────────
  const CounterAnimation = {
    init() {
      const counters = document.querySelectorAll('[data-count]');
      if (!counters.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseFloat(el.dataset.count);
            const isDecimal = target % 1 !== 0;
            const duration = 2000;
            const start = performance.now();

            const animate = (now) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
              const current = eased * target;

              if (isDecimal) {
                el.textContent = current.toFixed(1);
              } else if (target >= 100) {
                el.textContent = Math.floor(current) + '+';
              } else {
                el.textContent = Math.floor(current);
              }

              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.3 });

      counters.forEach(c => observer.observe(c));
    }
  };

  // ── Progress Bar Animation ─────────────────────────────────────────
  const ProgressBarAnimation = {
    init() {
      const bars = document.querySelectorAll('.skill-bar__fill[data-progress]');
      if (!bars.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            setTimeout(() => {
              bar.style.width = bar.dataset.progress + '%';
            }, 200);
            observer.unobserve(bar);
          }
        });
      }, { threshold: 0.5 });

      bars.forEach(b => observer.observe(b));
    }
  };

  // ── Booking Calendar ───────────────────────────────────────────────
  const BookingCalendar = {
    init() {
      const grid = document.getElementById('bookingGrid');
      const monthLabel = document.getElementById('bookingMonth');
      if (!grid) return;

      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

      monthLabel.textContent = `${months[month]} ${year}`;

      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const today = now.getDate();

      let html = '';
      // Empty cells before first day
      for (let i = 0; i < firstDay; i++) {
        html += '<div class="booking-day booking-day--empty"></div>';
      }

      // Days
      for (let d = 1; d <= daysInMonth; d++) {
        const dayOfWeek = new Date(year, month, d).getDay();
        const isPast = d < today;
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        if (isPast || isWeekend) {
          html += `<div class="booking-day booking-day--busy">${d}</div>`;
        } else {
          html += `<div class="booking-day booking-day--active" onclick="bookSlot('Dia ${d}, ${months[month]}')">${d}</div>`;
        }
      }

      grid.innerHTML = html;
    }
  };

  // ── Tilt Effect on Cards ───────────────────────────────────────────
  const TiltEffect = {
    init() {
      const cards = document.querySelectorAll('.neo-card, .social-card, .skill-card, .social-phone');
      cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -3;
          const rotateY = ((x - centerX) / centerX) * 3;
          card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(-2px,-2px)`;
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    }
  };

  // ── Floating Icons Generator ──────────────────────────────────────────
  const FloatingIconsManager = {
    init() {
      const container = document.getElementById('floatingIcons');
      if (!container) return;

      const svgs = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>', // Star
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path><path d="M4 22h16"></path></svg>', // Book
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line></svg>', // Globe
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>', // Book open
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>', // Zap
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path></svg>', // Folder
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><circle cx="15" cy="13" r="1"></circle><circle cx="18" cy="11" r="1"></circle><rect x="2" y="6" width="20" height="12" rx="2"></rect></svg>', // Gamepad
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>' // Target
      ];

      // Number of icons depending on screen height (roughly 3 icons per 1000px height)
      const pageHeight = document.body.scrollHeight;
      const numIcons = Math.max(50, Math.floor((pageHeight / 1000) * 18));

      for (let i = 0; i < numIcons; i++) {
        const icon = document.createElement('span');
        icon.className = 'float-icon';
        
        // Randomize
        const randomSvg = svgs[Math.floor(Math.random() * svgs.length)];
        const top = Math.random() * 95; // 0% to 95%
        const left = Math.random() * 95; // Anywhere horizontally
        const delay = Math.random() * 5; // 0s to 5s animation delay
        const scale = 0.5 + Math.random() * 1.5; // 0.5 to 2.0 scale
        const opacity = 0.1 + Math.random() * 0.4; // 0.1 to 0.5 opacity

        icon.innerHTML = randomSvg;
        icon.style.top = `${top}%`;
        icon.style.left = `${left}%`;
        icon.style.animationDelay = `${delay}s`;
        icon.style.transform = `scale(${scale})`;
        icon.style.opacity = opacity;

        container.appendChild(icon);
      }
    }
  };

  // ── Service Worker ────────────────────────────────────────────────────
  const ServiceWorkerManager = {
    init() {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('./sw.js')
            .then(reg => {
              // Check for updates
              reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'activated') {
                    Toast.show('Site atualizado!');
                  }
                });
              });
            })
            .catch(() => { /* SW registration failed silently */ });
        });
      }
    }
  };

  // ── Initialize Everything ─────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    LoadingScreen.init();
    ScrollEffects.init();
    RevealObserver.init();
    MobileMenu.init();
    Toast.init();
    ModalSystem.init();
    SmoothScroll.init();
    CursorManager.init();
    CounterAnimation.init();
    ProgressBarAnimation.init();
    BookingCalendar.init();
    TiltEffect.init();
    FloatingIconsManager.init();
    ServiceWorkerManager.init();

    // Theme toggle button
    const themeToggle = document.querySelector('.neo-theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => ThemeManager.toggle());
    }
  });

  // Expose Toast globally for inline usage
  window.TL = { Toast };
})();

// Global booking slot function
function bookSlot(timeLabel) {
  const msg = encodeURIComponent(`Olá, Teacher Lupi! Quero agendar uma aula experimental no horário: ${timeLabel}`);
  window.open(`https://wa.me/5592981632991?text=${msg}`, '_blank');
}
