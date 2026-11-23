/**
 * PRINCE PATEL — MINIMALIST NEUMORPHIC PORTFOLIO
 * High tactile reactivity, live telemetry, dual-theme switcher, and interactive terminal.
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER FOR SOFT NEUMORPHIC TACTILE CLICKS ---
  let audioEnabled = false;
  let audioCtx = null;

  function playSoftClick(type = 'click') {
    if (!audioEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch (e) {
      // Audio context unsupported or blocked
    }
  }

  // --- LIVE IST CLOCK ---
  function initLiveClock() {
    const clockEl = document.getElementById('live-ist-clock');
    if (!clockEl) return;

    function updateTime() {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      const timeStr = now.toLocaleTimeString('en-GB', options);
      clockEl.textContent = `IST ${timeStr} [UTC+05:30]`;
    }

    updateTime();
    setInterval(updateTime, 1000);
  }

  // --- NEUMORPHIC THEME TOGGLE (LIGHT / DARK) ---
  function initTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeSvg = document.getElementById('theme-svg');
    const savedTheme = localStorage.getItem('prince_neu_theme') || 'dark';

    function setIcon(theme) {
      if (!themeSvg) return;
      if (theme === 'dark') {
        // Sun icon
        themeSvg.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
      } else {
        // Moon icon
        themeSvg.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
      }
    }

    applyTheme(savedTheme);

    function applyTheme(themeName) {
      if (themeName === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        setIcon('dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        setIcon('light');
      }
      localStorage.setItem('prince_neu_theme', themeName);
    }

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        playSoftClick('pop');
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        showToast(nextTheme === 'dark' ? 'Dark Neumorphism Active' : 'Light Neumorphism Active');
      });
    }
  }

  // --- AUDIO TOGGLE ---
  function initAudioToggle() {
    const btn = document.getElementById('audio-toggle-btn');
    const svg = document.getElementById('audio-svg');
    if (!btn) return;

    btn.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      if (svg) {
        if (audioEnabled) {
          svg.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
        } else {
          svg.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
        }
      }
      showToast(audioEnabled ? 'Tactile Haptics: Enabled' : 'Tactile Haptics: Muted');
      if (audioEnabled) playSoftClick('pop');
    });
  }

  // --- TOAST NOTIFICATIONS ---
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // --- COPY EMAIL TO CLIPBOARD ---
  function initEmailCopy() {
    const emailToCopy = 'prince.patel3628@gmail.com';
    const heroCopyBtn = document.getElementById('copy-email-hero-btn');
    const boxCopyBtn = document.getElementById('copy-email-box-btn');

    function performCopy() {
      playSoftClick('click');
      navigator.clipboard.writeText(emailToCopy).then(() => {
        showToast('Email copied to clipboard: ' + emailToCopy);
      }).catch(() => {
        window.prompt('Copy email address:', emailToCopy);
      });
    }

    if (heroCopyBtn) heroCopyBtn.addEventListener('click', performCopy);
    if (boxCopyBtn) boxCopyBtn.addEventListener('click', performCopy);
  }

  // --- PROJECT DEEP DIVE TABS ---
  function initProjectTabs() {
    const deepdiveWrappers = document.querySelectorAll('.deepdive-wrapper');

    deepdiveWrappers.forEach(wrap => {
      const toggleBtns = wrap.querySelectorAll('.deepdive-toggle-btn');
      const panes = wrap.querySelectorAll('.deepdive-pane');

      toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          playSoftClick('click');
          const targetTab = btn.getAttribute('data-tab');

          toggleBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          panes.forEach(pane => {
            if (pane.getAttribute('data-pane') === targetTab) {
              pane.classList.add('active');
            } else {
              pane.classList.remove('active');
            }
          });
        });
      });
    });
  }

  // --- TECHNICAL DNA SKILLS FILTER ---
  function initSkillsFilter() {
    const filterBtns = document.querySelectorAll('.filter-pill-btn');
    const skillCards = document.querySelectorAll('.skill-category-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        playSoftClick('click');
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        skillCards.forEach(card => {
          const cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- INTERACTIVE TERMINAL CLI ---
  function initTerminal() {
    const inputEl = document.getElementById('term-input');
    const outputEl = document.getElementById('term-output');
    const presetBtns = document.querySelectorAll('.term-btn');

    if (!inputEl || !outputEl) return;

    const commands = {
      help: () => [
        '================ AVAILABLE COMMANDS ================',
        '  help        - List commands',
        '  projects    - Production platforms overview',
        '  skills      - Technical competencies & stack',
        '  principles  - The 4 core engineering rules',
        '  whoami      - Developer profile & coordinates',
        '  status      - Telemetry health check',
        '  date        - Current timestamp in IST',
        '  repo        - Direct code repositories',
        '  contact     - Transmission channels',
        '  clear       - Purge terminal buffer'
      ].join('\n'),

      projects: () => [
        '--- PRODUCTION SYSTEMS ---',
        '1. SPONSORLY (2026)',
        '   Role: Creator Economy & Marketplace with Escrow Engine',
        '   Stack: TypeScript, Next.js, Node.js, PostgreSQL, Redis, Tailwind CSS',
        '   Code: https://github.com/prince312pp/sponsorly',
        '',
        '2. TIFFINMITRA (2026)',
        '   Role: Authentic Meal Marketplace & Logistics',
        '   Stack: TypeScript, Next.js, React Native, Redis, MongoDB, Docker',
        '   Code: https://github.com/prince312pp/tiffinmitra_prototype'
      ].join('\n'),

      skills: () => [
        '--- TECHNOLOGIES & CORE STACK ---',
        '• Application & UI: React, Next.js (App Router), React Native, Tailwind CSS',
        '• Languages: TypeScript, JavaScript (ESNext), Node.js, Python, SQL',
        '• Backend & Services: Node.js, Express, REST APIs, WebSockets, State Machines',
        '• Data & Storage: PostgreSQL, Redis (Locks & Cache), MongoDB, Prisma ORM',
        '• DevOps: Docker, Git, GitHub Actions, Vercel, Linux CLI'
      ].join('\n'),

      principles: () => [
        '--- CORE ENGINEERING PRINCIPLES ---',
        'Rule 01: Deterministic state over fragile logic',
        'Rule 02: Speed and brutal clarity (zero bloat)',
        'Rule 03: Defensive data design (ACID ledgers + flexible docs)',
        'Rule 04: End-to-end ownership (design to production telemetry)'
      ].join('\n'),

      whoami: () => [
        'Operator: Prince Patel',
        'Role: Full-Stack Software Builder & Systems Architect',
        'Location: Ahmedabad, Gujarat, India [23.02° N, 72.57° E]',
        'Education: B.Tech IT at JG University | Diploma IT (Distinction)',
        'Quote: I write software where state is deterministic, dependencies are minimal, and failure modes are accounted for.'
      ].join('\n'),

      status: () => [
        'Core Engine: Operational',
        'Deterministic Score: 100% Pass',
        'Escrow State Machine: Verified',
        'Cutoff Scheduler: Active',
        'System Uptime: 99.9%'
      ].join('\n'),

      date: () => {
        return 'Node Time: ' + new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
      },

      repo: () => [
        'Repositories:',
        '• Sponsorly: https://github.com/prince312pp/sponsorly',
        '• TiffinMitra: https://github.com/prince312pp/tiffinmitra_prototype',
        '• Profile: https://github.com/prince312pp'
      ].join('\n'),

      contact: () => [
        'Transmission Channels:',
        'Email: prince.patel3628@gmail.com',
        'GitHub: https://github.com/prince312pp',
        'LinkedIn: https://www.linkedin.com/in/prince-patel-b102492b1/',
        'Twitter: https://x.com/PrincePate18399'
      ].join('\n'),

      clear: () => {
        outputEl.innerHTML = '';
        return null;
      }
    };

    // Alias manifesto to principles
    commands.manifesto = commands.principles;

    function appendOutput(cmd, res) {
      if (cmd) {
        const cmdLine = document.createElement('div');
        cmdLine.className = 'term-line';
        cmdLine.style.color = '#ffffff';
        cmdLine.textContent = `prince@system:~$ ${cmd}`;
        outputEl.appendChild(cmdLine);
      }

      if (res !== null) {
        const resLine = document.createElement('div');
        resLine.className = 'term-line';
        resLine.textContent = res;
        outputEl.appendChild(resLine);
      }

      outputEl.scrollTop = outputEl.scrollHeight;
    }

    function execute(rawCmd) {
      const cleanCmd = rawCmd.trim().toLowerCase();
      if (!cleanCmd) return;
      playSoftClick('pop');

      if (commands[cleanCmd]) {
        const response = commands[cleanCmd]();
        appendOutput(rawCmd, response);
      } else {
        appendOutput(rawCmd, `command not found: "${rawCmd}". Type 'help' for instructions.`);
      }
    }

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        execute(inputEl.value);
        inputEl.value = '';
      }
    });

    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        execute(cmd);
      });
    });
  }

  // --- CONTACT FORM TRANSMISSION ---
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      playSoftClick('click');

      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;

      showToast('Preparing email client dispatch...');

      setTimeout(() => {
        const mailtoUri = `mailto:prince.patel3628@gmail.com?subject=${encodeURIComponent('[PORTFOLIO DISPATCH] ' + subject)}&body=${encodeURIComponent(`FROM: ${name} (${email})\n\n${message}`)}`;
        window.location.href = mailtoUri;
        showToast('Email client launched!');
      }, 600);
    });
  }

  // --- BACK TO TOP BUTTON ---
  function initBackToTop() {
    const topBtn = document.getElementById('back-to-top');
    if (!topBtn) return;

    topBtn.addEventListener('click', () => {
      playSoftClick('click');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- INITIALIZE ALL SUBSYSTEMS ---
  document.addEventListener('DOMContentLoaded', () => {
    initLiveClock();
    initTheme();
    initAudioToggle();
    initEmailCopy();
    initProjectTabs();
    initSkillsFilter();
    initTerminal();
    initContactForm();
    initBackToTop();

    // Attach subtle click feedback to buttons and interactive links
    document.querySelectorAll('.btn, .nav-link, .social-pill, .filter-pill-btn').forEach(el => {
      el.addEventListener('click', () => playSoftClick('click'));
    });
  });
})();
