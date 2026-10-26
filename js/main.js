/**
 * Aires Jhoy J. Giverola - Personal CV & Portfolio
 * Vanilla JavaScript (No Build Tools Required)
 */

function runWhenReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

runWhenReady(() => {
  initThemeToggle();
  initMobileMenu();
  initScrollSpy();
  initScrollAnimations();
  initSkillBars();
  initCopyButtons();
  initContactForm();
  initPrintButton();
  initCertificateModal();
});

/* --------------------------------------------------------------------------
   2. Dark Mode / Theme Toggle
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('aires_cv_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  updateThemeIcon(currentTheme === 'dark');

  const handleToggle = (e) => {
    e.preventDefault();
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('aires_cv_theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
    showToast(isDark ? 'Switched to Dark Mode ✦' : 'Switched to Light Mode ✦');
  };

  themeToggleBtn.onclick = handleToggle;
  themeToggleBtn.ontouchend = handleToggle;
}

function updateThemeIcon(isDark) {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;
  themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggleBtn.innerHTML = isDark
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
}

/* --------------------------------------------------------------------------
   3. Mobile Menu Navigation
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navMenu) return;

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen.toString());
  }

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      toggleMenu(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* --------------------------------------------------------------------------
   4. Scroll Spy & Navbar Shadow
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Navbar elevation shadow
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   5. Scroll-triggered Fade & Slide Animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-fade');
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   6. Animated Skill Progress Bars
   -------------------------------------------------------------------------- */
function initSkillBars() {
  const skillSection = document.getElementById('skills');
  const progressFills = document.querySelectorAll('.skill-progress-bar-fill');

  if (!skillSection || progressFills.length === 0) return;

  let animated = false;

  const triggerAnimation = () => {
    if (animated) return;
    progressFills.forEach(bar => {
      const targetPercent = bar.getAttribute('data-target-progress') || '0';
      bar.style.width = targetPercent + '%';
    });
    animated = true;
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerAnimation();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(skillSection);
  } else {
    triggerAnimation();
  }
}

/* --------------------------------------------------------------------------
   7. Copy to Clipboard Utility
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copied "${text}" to clipboard!`);
        }).catch(() => {
          fallbackCopyText(text);
        });
      } else {
        fallbackCopyText(text);
      }
    });
  });

  function fallbackCopyText(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(`Copied "${text}" to clipboard!`);
  }
}

/* --------------------------------------------------------------------------
   8. Contact Form Handling
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successBox = document.getElementById('contact-success-box');
  const mailtoLink = document.getElementById('contact-mailto-link');
  const resetBtn = document.getElementById('contact-reset-btn');

  if (!form || !successBox) return;

  form.onsubmit = (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const subjectInput = form.querySelector('[name="subject"]')?.value.trim();
    const message = form.querySelector('[name="message"]')?.value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.');
      return;
    }

    const targetEmail = 'airesjhoyjgiverola@gmail.com';
    const mailSubject = encodeURIComponent(subjectInput || `Portfolio Inquiry from ${name}`);
    const mailBody = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

    const mailtoUrl = `mailto:${targetEmail}?subject=${mailSubject}&body=${mailBody}`;

    if (mailtoLink) {
      mailtoLink.href = mailtoUrl;
    }

    form.style.display = 'none';
    successBox.style.display = 'block';
    showToast('Message ready! Click Open Email App to send.');
  };

  if (resetBtn) {
    resetBtn.onclick = () => {
      form.reset();
      form.style.display = 'block';
      successBox.style.display = 'none';
    };
  }
}

/* --------------------------------------------------------------------------
   9. Print CV / Download Feature
   -------------------------------------------------------------------------- */
function initPrintButton() {
  const printBtns = document.querySelectorAll('[data-action="print-cv"]');
  printBtns.forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      try {
        window.print();
      } catch (err) {
        showToast('Please use browser menu to print/save as PDF.');
      }
    };
  });
}

/* --------------------------------------------------------------------------
   10. Toast Notification Helper
   -------------------------------------------------------------------------- */
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

/* --------------------------------------------------------------------------
   11. Certificate Lightbox Modal
   -------------------------------------------------------------------------- */
function initCertificateModal() {
  const modal = document.getElementById('cert-modal');
  if (!modal) return;

  const modalImg = document.getElementById('cert-modal-img');
  const modalTitle = document.getElementById('cert-modal-title');
  const modalMeta = document.getElementById('cert-modal-meta');
  const modalPdfLink = document.getElementById('cert-modal-pdf');
  const closeBtn = document.getElementById('cert-modal-close');

  const openModal = (imgSrc, title, meta, pdfUrl) => {
    if (modalImg) modalImg.src = imgSrc;
    if (modalTitle) modalTitle.textContent = title;
    if (modalMeta) modalMeta.textContent = meta;
    if (modalPdfLink) {
      if (pdfUrl) {
        modalPdfLink.href = pdfUrl;
        modalPdfLink.style.display = 'inline-flex';
      } else {
        modalPdfLink.style.display = 'none';
      }
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-cert-preview]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = trigger.getAttribute('data-cert-img');
      const title = trigger.getAttribute('data-cert-title') || 'Certificate of Completion';
      const meta = trigger.getAttribute('data-cert-meta') || '';
      const pdfUrl = trigger.getAttribute('data-cert-pdf') || '';
      openModal(imgSrc, title, meta, pdfUrl);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

