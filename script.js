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
      summaryZh: '校园本地生活产品。工程重点是把自然语言意图转成可约束的检索，再让推荐回到真实店铺、菜单与公开评价证据。产品同时包含 AI Meal Agent 与 QQBot 两条对话入口。',
      summaryEn: 'A campus local-life product. The engineering challenge is turning natural-language intent into constrained retrieval, then grounding recommendations in real shops, menus, and public review evidence across the AI Meal Agent and QQBot.',
      pointsZh: [
        'QQBot 只响应 @ 消息与明确命令，产品边界是校园餐饮和本地生活发现，不做开放域聊天。',
        '规划模型将自然语言收敛为 QueryPlan；学校、公开可见性、店铺 ID 和事实字段始终由服务端决定。',
        '菜品/品类、店铺、检索词三路召回；先执行学校、地点、店型、预算、排除项等硬过滤，再对最多 8 个真实候选重排。',
        '模型只能引用候选并返回受限原因码；店名、价格、营业边界和最终卡片由服务端根据数据库事实生成。',
        'Redis 租约、事件去重、有界队列、加密追加式推荐追踪与 requestId 反馈关联，构成运行与复盘闭环。',
        'Meal Agent 使用当前学校的地点目录与 opaque locationRef；服务端重新校验范围后才转换为真实区域过滤。'
      ],
      pointsEn: [
        'QQBot responds to mentions and explicit commands within campus food and local-life discovery; it is not an open-domain chatbot.',
        'A planning model turns natural language into a QueryPlan, while school scope, public visibility, shop IDs, and factual fields remain server-owned.',
        'Dish/category, shop, and retrieval-term recall feed hard filters for school, location, shop type, budget, and exclusions before at most eight real candidates reach reranking.',
        'The model may only reference candidates and return constrained reason codes; the server renders shop names, prices, operating caveats, and final cards from database facts.',
        'Redis leases, event deduplication, a bounded queue, encrypted append-only recommendation traces, and requestId-linked feedback form the runtime and review loop.',
        'The Meal Agent uses a current-school location catalog and opaque locationRefs; the server validates scope before mapping them to actual location filters.'
      ],
      tags: ['Java 17','Spring Boot','MyBatis-Plus','MySQL','Redis','WebSocket','Agent Runtime','Retrieval','Reranking','Observability'],
      noteZh: '主业务仓库为私有仓库。以上内容根据项目模块、技术文档与实现记录整理；不公开源代码、用户数据、密钥或内部部署细节。检索与评测数据未经过公开披露，因此不展示虚构的准确率、延迟或用户规模。',
      noteEn: 'The primary repositories are private. This summary is based on project modules, technical docs, and implementation records; source code, user data, credentials, and internal deployment details are not published. No unverified accuracy, latency, or user-scale metrics are claimed.'
    },
    weoam: {
      kicker: 'PRIVATE PROJECT / WECHAT OAM',
      title: 'WeChatOAM — Official Account Management',
      summaryZh: '基于 Java 17 与 Spring Boot 的微信公众号管理后端，覆盖授权、文章与草稿、素材、统计，以及文档和压缩包处理。',
      summaryEn: 'A Java 17 and Spring Boot backend for WeChat Official Account operations, covering authorization, articles and drafts, media, analytics, and document/archive processing.',
      pointsZh: [
        '围绕公众号授权与官方 API 集成，组织文章、草稿、素材等管理工作流。',
        '大文件上传采用预签名 URL：客户端直接 PUT 到腾讯 COS，再调用 confirm 创建异步处理任务。',
        '任务队列只携带对象引用和元数据，前端通过 taskId 查询状态，文件内容不需要经过应用服务器。',
        '提供首页统计、月度趋势与收入同步入口，定时任务负责同步相关数据。',
        '项目依赖中包含 DOCX、Markdown、压缩包处理组件，支撑内容导入与转换场景。'
      ],
      pointsEn: [
        'Organizes article, draft, and media workflows around WeChat authorization and official API integration.',
        'Large-file uploads use a pre-signed URL: the client PUTs directly to Tencent COS, then calls confirm to create an asynchronous processing task.',
        'The task queue carries object references and metadata; the frontend follows status by taskId, so file bytes do not pass through the application server.',
        'Provides home statistics, monthly trends, and revenue-sync entry points, with scheduled jobs handling related synchronization.',
        'Dependencies include DOCX, Markdown, and archive-processing components for content import and conversion workflows.'
      ],
      tags: ['Java 17','Spring Boot 3.4.5','MyBatis-Plus','MySQL','Redis','Elasticsearch','Tencent COS','Async Tasks'],
      noteZh: '仓库为私有仓库。技术栈来自 pom.xml，上传流程来自 DirectUploadController，统计入口来自 StatsController；本页不暴露内部接口凭据、配置和客户数据。',
      noteEn: 'The repository is private. The stack is based on pom.xml, the upload flow on DirectUploadController, and analytics entry points on StatsController. No credentials, internal configuration, or client data are exposed.'
    },
    siem: {
      kicker: 'PROFESSIONAL EXPERIENCE / SECURITY AI',
      title: 'SIEM Agent — Security Operations',
      summaryZh: '参与安全风控场景下的 SIEM Agent 工程实践。关注点是把模型能力接入既有安全系统，并让工具执行、运行时状态和评测链路可控、可观察。',
      summaryEn: 'Contributed to SIEM Agent engineering in a security context, integrating model capabilities with existing security systems while keeping tool execution, runtime state, and evaluation observable and controlled.',
      pointsZh: [
        '使用 Java 进行 Agent 工具开发与后端能力集成。',
        '参与模型接入、对话编排与 Agent 运行时相关工作。',
        '关注工具调用结果、运行状态、失败处理和可追踪性。',
        '参与 Agent 评测与安全检测，验证行为边界而不是只看模型是否能回答。'
      ],
      pointsEn: [
        'Developed agent tools and backend integrations in Java.',
        'Worked on model integration, conversation orchestration, and agent runtime concerns.',
        'Focused on tool outcomes, execution state, failure handling, and traceability.',
        'Contributed to agent evaluation and safety checks, validating behavioral boundaries rather than only answer quality.'
      ],
      tags: ['Java','Agent Tools','Model Integration','Runtime','Evaluation','Safety'],
      noteZh: '这是职业经历的公开安全概述。雇主代码、内部架构、真实安全事件、数据和运行指标均不在此披露。',
      noteEn: 'This is a public-safe summary of professional experience. Employer source code, internal architecture, real security events, data, and operational metrics are not disclosed.'
    },
    browser: {
      kicker: 'PROFESSIONAL EXPERIENCE / BROWSER AUTOMATION',
      title: 'AI Browser Agent',
      summaryZh: '基于 TypeScript 的 Browser Agent 项目实践，将模型决策连接到真实浏览器动作，面向动态商品页面进行结构化信息提取与自动化流程验证。',
      summaryEn: 'A TypeScript Browser Agent project connecting model decisions to real browser actions, with structured extraction from dynamic product pages and workflow verification.',
      pointsZh: [
        '使用 TypeScript 组织 Browser Agent 的端到端工程流程。',
        '把页面观察、动作执行和结果验证连接成闭环，而不是只生成操作建议。',
        '围绕动态页面结构、浏览器状态和数据提取稳定性处理工程问题。',
        '在公开描述中只概括自动化与可靠性挑战，不披露内部站点和专有风控实现。'
      ],
      pointsEn: [
        'Used TypeScript across the Browser Agent engineering workflow.',
        'Connected page observation, action execution, and result verification into a loop rather than merely generating action suggestions.',
        'Worked through engineering issues around dynamic page structure, browser state, and extraction reliability.',
        'The public description stays at the automation and reliability level and does not expose internal sites or proprietary risk-control implementation.'
      ],
      tags: ['TypeScript','Browser Automation','Agent Workflow','Page Extraction','Reliability'],
      noteZh: '这是职业项目的公开安全概述，不包含内部站点细节、专有反爬策略或保密实现。',
      noteEn: 'This is a public-safe summary of professional project experience. It excludes internal site details, proprietary anti-bot strategies, and confidential implementation.'
    },
    studio: {
      kicker: 'COLLABORATIVE DELIVERY / STUDIO',
      title: 'Studio Projects — Engineering Delivery',
      summaryZh: '参与工作室多类软件项目建设，覆盖业务平台、数据可视化、AI 工具和自动化流程。',
      summaryEn: 'Collaborative software work across business platforms, dashboards, AI-assisted tools, and automation-oriented products.',
      pointsZh: [
        '将业务需求转化为可用的产品流程与技术范围。',
        '在后端、前端、数据可视化和系统集成之间协作。',
        '关注可维护性、交付质量与跨角色沟通。'
      ],
      pointsEn: [
        'Translate business requirements into usable product workflows and technical scope.',
        'Work across backend, frontend, data visualization, and integration boundaries.',
        'Prioritize maintainability, delivery quality, and clear communication across roles.'
      ],
      tags: ['Product Thinking','Full-stack','System Design','Integration','Delivery'],
      noteZh: '客户与合作方项目仅按类别概述，不公开客户名称、私有部署、客户信息或源代码。',
      noteEn: 'Client and partner projects are summarized at category level only. Names, private deployments, client information, and source code are not published here.',
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
    const language = root.dataset.language === 'zh' ? 'zh' : 'en';
    $('#dialog-summary').textContent = language === 'zh' ? data.summaryZh : data.summaryEn;
    const points = $('#dialog-points');
    const activePoints = language === 'zh' ? data.pointsZh : data.pointsEn;
    points.replaceChildren(...activePoints.map(text => {
      const li = document.createElement('li'); li.textContent = text; return li;
    }));
    const tags = $('#dialog-tags');
    tags.replaceChildren(...data.tags.map(text => {
      const span = document.createElement('span'); span.textContent = text; return span;
    }));
    $('#dialog-note').textContent = language === 'zh' ? data.noteZh : data.noteEn;
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

