/* ==========================================================================
   TEACHER LUPI — COMPONENT LOGIC
   FAQ accordion, typing effect, counters
   ========================================================================== */

(function () {
  'use strict';

  // ── FAQ Accordion ─────────────────────────────────────────────────────
  const Accordion = {
    init() {
      document.querySelectorAll('.neo-accordion__trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
          const item = trigger.closest('.neo-accordion__item');
          if (!item) return;

          const isOpen = item.classList.contains('is-open');
          const accordion = item.closest('.neo-accordion');

          // Close all siblings
          if (accordion) {
            accordion.querySelectorAll('.neo-accordion__item.is-open').forEach(openItem => {
              openItem.classList.remove('is-open');
              const t = openItem.querySelector('.neo-accordion__trigger');
              if (t) t.setAttribute('aria-expanded', 'false');
            });
          }

          // Toggle current
          if (!isOpen) {
            item.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
          }
        });
      });
    }
  };

  // ── Typing Effect ─────────────────────────────────────────────────────
  const TypingEffect = {
    phrases: [
      'Level Up Your English_',
      'Unlock Fluency_',
      'Start Your Quest_',
      'Master The Language_'
    ],
    el: null,
    index: 0,
    charIndex: 0,
    isDeleting: false,
    timeout: null,

    init() {
      this.el = document.querySelector('[data-typing]');
      if (!this.el) return;

      // Check reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.el.textContent = this.phrases[0];
        return;
      }

      this.type();
    },

    type() {
      const current = this.phrases[this.index];

      if (this.isDeleting) {
        this.el.textContent = current.substring(0, this.charIndex - 1);
        this.charIndex--;
      } else {
        this.el.textContent = current.substring(0, this.charIndex + 1);
        this.charIndex++;
      }

      let delay = this.isDeleting ? 40 : 80;

      if (!this.isDeleting && this.charIndex === current.length) {
        delay = 2000;
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.index = (this.index + 1) % this.phrases.length;
        delay = 400;
      }

      this.timeout = setTimeout(() => this.type(), delay);
    }
  };

  // ── Initialize ────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    Accordion.init();
    TypingEffect.init();
  });
})();
