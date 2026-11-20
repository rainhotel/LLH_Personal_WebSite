(() => {
  const root = document.documentElement;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme and language preferences are intentionally local to this browser.
  const getPreference = (key, fallback) => {
    try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
  };
  const setPreference = (key, value) => {
    try { localStorage.setItem(key, value); } catch { /* storage may be unavailable */ }
  };
  const setTheme = (theme) => {
    root.dataset.theme = theme;
    setPreference('llh-theme', theme);
    const themeColor = $('meta[name="theme-color"]');
    if (themeColor) themeColor.content = theme === 'dark' ? '#0e1418' : '#f5f5f1';
    $('#theme-toggle')?.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  };
  const setLanguage = (language) => {
    root.dataset.language = language;
    root.lang = language === 'zh' ? 'zh-CN' : 'en';
    setPreference('llh-language', language);
    $$('[data-zh][data-en]').forEach(element => {
      element.textContent = language === 'zh' ? element.dataset.zh : element.dataset.en;
    });
    const button = $('#language-toggle');
    if (button) {
      button.textContent = language === 'zh' ? 'EN' : '中';
      button.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换到中文');
    }
  };
  setTheme(getPreference('llh-theme', 'light'));
  setLanguage(getPreference('llh-language', 'zh'));
  $('#theme-toggle')?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  $('#language-toggle')?.addEventListener('click', () => setLanguage(root.dataset.language === 'zh' ? 'en' : 'zh'));

  // Mobile navigation.
  const menuButton = $('#menu-toggle');
  const nav = $('#main-nav');
  const closeMenu = () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('is-open');
  };
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('is-open', open);
  });
  $$('#main-nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  // Header state, scroll progress, and active section navigation.
  const progress = $('#scroll-progress-bar');
  const updateScroll = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    if (progress) progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
    $('.site-header')?.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  const navLinks = $$('#main-nav a');
  const sections = ['about', 'work', 'opensource', 'engineering', 'contact'].map(id => document.getElementById(id)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Reveal sections progressively; content remains visible when observers are unavailable.
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Project filtering.
  const filters = $$('.filter-button');
  const cards = $$('.project-card');
  const count = $('#visible-project-count');
  filters.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    let visible = 0;
    cards.forEach(card => {
      const show = filter === 'all' || card.dataset.category.split(' ').includes(filter);
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (count) count.textContent = String(visible).padStart(2, '0');
  }));

  // Project case-study dialog: concise, public-safe descriptions grounded in project context.
  const projectDetails = {
    campusbites: {
      kicker: 'INDEPENDENT PRODUCT / CAMPUSBites',
      title: 'CampusBites — 校园老吃家',
      summary: 'A campus food community and decision product designed around trusted student participation, useful shop information, and better everyday food choices.',
      points: [
        'Student-oriented identity and content trust: WeChat login and student verification workflows.',
        'Core community loop: shop discovery, reviews, comments, moderation, and shop recommendations.',
        'Decision experience: “今天吃什么” weighted recommendation flow.',
        'Current exploration: shop and dish semantics, AI retrieval, conversational recommendations, and QQBot end-to-end workflows.'
      ],
      tags: ['Java 17', 'Spring Boot', 'MyBatis-Plus', 'MySQL', 'Redis', 'WeChat Mini Program', 'Vant Weapp', 'AI Retrieval'],
      note: 'The primary product repositories are private. This page describes product scope and engineering direction without exposing private source code, credentials, user data, or unfinished work as shipped functionality.',
      link: '',
      linkLabel: ''
    },
    weoam: {
      kicker: 'PRIVATE PROJECT / WECHAT OAM',
      title: 'WeChatOAM — Official Account Management',
      summary: 'A Java backend project for managing WeChat Official Account operations and content workflows.',
      points: [
        'Integrates WeChat Official Account APIs for authorization, media, drafts, and analytics-related workflows.',
        'Includes document and archive processing paths, with DOCX-to-HTML and Markdown-related capabilities reflected in project dependencies and docs.',
        'Uses a conventional layered backend foundation with persistence, cache, search, and object storage integrations.'
      ],
      tags: ['Java 17', 'Spring Boot 3.4.5', 'MyBatis-Plus', 'MySQL', 'Redis', 'Elasticsearch', 'Tencent COS', 'Weixin Java'],
      note: 'Repository is private. The technology list is based on the repository build configuration; this summary intentionally avoids exposing internal endpoints or configuration.',
      link: '',
      linkLabel: ''
    },
    siem: {
      kicker: 'PROFESSIONAL EXPERIENCE / SECURITY AI',
      title: 'SIEM Agent — Security Operations',
      summary: 'Engineering experience in applying agent workflows to security operations, with an emphasis on dependable backend integration rather than a chat-only interface.',
      points: [
        'Java backend work around agent tools, model integration, and orchestration.',
        'Runtime and conversation flow concerns: tool execution, state transitions, and traceable outcomes.',
        'Evaluation and safety checks to make agent behavior easier to inspect and improve.'
      ],
      tags: ['Java', 'Agent Tools', 'Model Integration', 'Runtime', 'Evaluation', 'Safety'],
      note: 'This is a high-level description of professional experience. Employer systems, source code, internal architecture, and operational data are intentionally not disclosed.',
      link: '',
      linkLabel: ''
    },
    browser: {
      kicker: 'PROFESSIONAL EXPERIENCE / BROWSER AUTOMATION',
      title: 'AI Browser Agent',
      summary: 'A TypeScript-based browser automation experience focused on connecting agent decisions with real browser actions and structured page information.',
      points: [
        'Browser Agent workflow design across observation, decision, action, and verification.',
        'Structured information extraction from dynamic web pages.',
        'Practical attention to browser state, automation reliability, and anti-automation constraints.'
      ],
      tags: ['TypeScript', 'Browser Automation', 'Agent Workflow', 'Web Extraction', 'Reliability'],
      note: 'This is a public-safe summary of professional project experience. No internal site details, proprietary anti-bot techniques, or confidential implementation are included.',
      link: '',
      linkLabel: ''
    },
    studio: {
      kicker: 'COLLABORATIVE DELIVERY / STUDIO',
      title: 'Studio Projects — Engineering Delivery',
      summary: 'Collaborative software work across business platforms, dashboards, AI-assisted tools, and automation-oriented products.',
      points: [
        'Translate business requirements into usable product workflows and technical scope.',
        'Work across backend, frontend, data visualization, and integration boundaries.',
        'Prioritize maintainability, delivery quality, and clear communication across roles.'
      ],
      tags: ['Product Thinking', 'Full-stack', 'System Design', 'Integration', 'Delivery'],
      note: 'Client and partner projects are summarized at category level only. Names, private deployments, client information, and source code are not published here.',
      link: 'https://github.com/FireOverEarth',
      linkLabel: 'VIEW PUBLIC WORKSTUDIO PROFILE ↗'
    }
  };
  const dialog = $('#project-dialog');
  const openProject = (key) => {
    const data = projectDetails[key];
    if (!data || !dialog) return;
    $('#dialog-kicker').textContent = data.kicker;
    $('#dialog-title').textContent = data.title;
    $('#dialog-summary').textContent = data.summary;
    const points = $('#dialog-points');
    points.replaceChildren(...data.points.map(text => {
      const li = document.createElement('li'); li.textContent = text; return li;
    }));
    const tags = $('#dialog-tags');
    tags.replaceChildren(...data.tags.map(text => {
      const span = document.createElement('span'); span.textContent = text; return span;
    }));
    $('#dialog-note').textContent = data.note;
    const link = $('#dialog-link');
    if (data.link) { link.href = data.link; link.textContent = data.linkLabel; link.hidden = false; }
    else { link.hidden = true; link.removeAttribute('href'); }
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  };
  $$('[data-open-project]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.openProject)));
  $('#dialog-close')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

  // Copy contact email with graceful fallback.
  const toast = $('#toast');
  let toastTimeout;
  const showToast = message => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove('is-visible'), 2400);
  };
  $('#copy-email')?.addEventListener('click', async () => {
    const email = 'lilinhao5292006@163.com';
    try {
      await navigator.clipboard.writeText(email);
      showToast(root.dataset.language === 'zh' ? '邮箱地址已复制' : 'Email address copied');
    } catch {
      window.location.href = `mailto:${email}`;
      showToast(root.dataset.language === 'zh' ? '正在打开邮件应用' : 'Opening your email app');
    }
  });

  // Decorative network animation. Pauses when the tab is hidden or reduced motion is preferred.
  const canvas = $('#network-canvas');
  const visual = $('#hero-visual');
  if (canvas && visual && !reducedMotion) {
    const context = canvas.getContext('2d');
    let width = 0, height = 0, frame = 0, pointer = { x: .5, y: .5 }, nodes = [];
    const resize = () => {
      const rect = visual.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      width = rect.width; height = rect.height;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(24, Math.min(52, Math.floor(width / 12)));
      nodes = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18,
        phase: index * .7, radius: Math.random() * 1.2 + .5
      }));
    };
    const draw = () => {
      if (document.hidden) { frame = 0; return; }
      context.clearRect(0, 0, width, height);
      const px = pointer.x * width, py = pointer.y * height;
      nodes.forEach((node, index) => {
        node.x += node.vx; node.y += node.vy;
        if (node.x < -10 || node.x > width + 10) node.vx *= -1;
        if (node.y < -10 || node.y > height + 10) node.vy *= -1;
        const dxp = node.x - px, dyp = node.y - py;
        const pointerDistance = Math.hypot(dxp, dyp);
        if (pointerDistance < 110) { node.x += dxp / (pointerDistance || 1) * .12; node.y += dyp / (pointerDistance || 1) * .12; }
        for (let next = index + 1; next < nodes.length; next++) {
          const other = nodes[next];
          const dx = node.x - other.x, dy = node.y - other.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 105) {
            context.strokeStyle = `rgba(184, 237, 138, ${(1 - distance / 105) * .13})`;
            context.lineWidth = .7;
            context.beginPath(); context.moveTo(node.x, node.y); context.lineTo(other.x, other.y); context.stroke();
          }
        }
        const pulse = .65 + Math.sin(performance.now() * .0007 + node.phase) * .18;
        context.fillStyle = `rgba(205, 237, 211, ${pulse})`;
        context.beginPath(); context.arc(node.x, node.y, node.radius, 0, Math.PI * 2); context.fill();
      });
      frame = window.requestAnimationFrame(draw);
    };
    const start = () => { if (!frame && !document.hidden) frame = window.requestAnimationFrame(draw); };
    const stop = () => { if (frame) window.cancelAnimationFrame(frame); frame = 0; };
    visual.addEventListener('pointermove', event => {
      const rect = visual.getBoundingClientRect();
      pointer = { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height };
    }, { passive: true });
    visual.addEventListener('pointerleave', () => { pointer = { x: .5, y: .5 }; });
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    resize(); start();
  }

  const year = $('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
