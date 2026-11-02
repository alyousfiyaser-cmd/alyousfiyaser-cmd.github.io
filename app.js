/* ---------- Analytics: Umami + Microsoft Clarity + Cloudflare Web Analytics ----------
   Owner opt-out (per browser/device): open any page with ?notrack  -> your visits are no longer counted.
   Re-enable on that browser:          open any page with ?track
   Scripts load asynchronously after the page, so they never block rendering. */
(function () {
  'use strict';
  var KEY = 'ya_notrack';
  var ls = null;
  try { ls = window.localStorage; } catch (e) {}

  function note(msg) {
    function show() {
      var n = document.createElement('div');
      n.textContent = msg;
      n.setAttribute('role', 'status');
      n.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:99999;background:#111;color:#fff;padding:12px 18px;border-radius:10px;font:14px/1.4 system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.4);max-width:90vw;text-align:center';
      document.body.appendChild(n);
      setTimeout(function () { n.remove(); }, 5000);
    }
    if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);
  }

  var params = location.search;
  try {
    if (/[?&]notrack(=|&|$)/.test(params)) {
      ls.setItem(KEY, '1');
      ls.setItem('umami.disabled', '1');
      note('Analytics disabled for this browser. Your visits will not be counted.');
    } else if (/[?&]track(=|&|$)/.test(params)) {
      ls.removeItem(KEY);
      ls.removeItem('umami.disabled');
      note('Analytics re-enabled for this browser.');
    }
  } catch (e) {}

  var off = false;
  try { off = !!ls && ls.getItem(KEY) === '1'; } catch (e) {}
  if (location.hostname !== 'alyousfiyaser-cmd.github.io') off = true; // ignore local previews/copies
  if (off || navigator.webdriver) return;

  function addScript(src, attrs) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) s.setAttribute(k, attrs[k]);
    document.head.appendChild(s);
  }

  // Umami: visitors, cities, sources, devices, pages, engagement, events
  addScript('https://cloud.umami.is/script.js', {
    'data-website-id': 'aa7e9429-11aa-4e65-8485-d476adf0ce00',
    'data-domains': 'alyousfiyaser-cmd.github.io'
  });

  // Cloudflare Web Analytics: page speed and Core Web Vitals
  addScript('https://static.cloudflareinsights.com/beacon.min.js', {
    'data-cf-beacon': '{"token": "8737827fb86f46c8be4f9c052a1cf99b"}'
  });

  // Microsoft Clarity: heatmaps, scroll depth, masked recordings, JS errors
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', 'z7h8xb0s3p');

  // Interaction events in Umami: outbound links, email/phone clicks, downloads
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || !window.umami || typeof window.umami.track !== 'function') return;
    var href = a.getAttribute('href') || '';
    var name = null, data = {};
    if (/^mailto:/i.test(href)) { name = 'email-click'; }
    else if (/^tel:/i.test(href)) { name = 'phone-click'; }
    else {
      var url;
      try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (a.hasAttribute('download') || /\.(pdf|docx?|xlsx?|pptx?|zip|vcf)$/i.test(url.pathname)) {
        name = 'download'; data.file = url.pathname.split('/').pop();
      } else if (url.origin !== location.origin && /^https?:$/.test(url.protocol)) {
        name = 'outbound-link'; data.url = url.hostname + url.pathname;
      }
    }
    if (!name) return;
    data.page = location.pathname;
    try { window.umami.track(name, data); } catch (err) {}
  }, true);
})();

/* Yaser Alyousfi — Executive Personal Profile
   Navigation, reveal-on-scroll, and page transition fallback. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var supportsVT = typeof document.startViewTransition === 'function' &&
                   CSS.supports('view-transition-name: none');

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    var btn = document.querySelector('.menu-btn');
    var nav = document.querySelector('.mobile-nav');
    if (!btn || !nav) return;

    function setOpen(open) {
      document.body.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    btn.addEventListener('click', function () {
      setOpen(!document.body.classList.contains('menu-open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    setOpen(false);
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Page transition fallback ---------- */
  function initTransitions() {
    if (supportsVT || reduced) return;
    document.documentElement.classList.add('no-vt');

    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;

      var url;
      try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.hash) return;
      if (url.href === location.href) return;
      if (!/\.html?$/.test(url.pathname) && !url.pathname.endsWith('/')) return;

      e.preventDefault();
      document.documentElement.classList.add('is-leaving');
      window.setTimeout(function () { location.href = url.href; }, 290);
    });

    window.addEventListener('pageshow', function (e) {
      if (e.persisted) document.documentElement.classList.remove('is-leaving');
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var last = null;
    function onScroll() {
      var solid = window.scrollY > 12;
      if (solid !== last) {
        header.style.boxShadow = solid ? '0 12px 40px -24px rgba(0,0,0,.9)' : 'none';
        last = solid;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Home: reveal the portrait backdrop past the hero ---------- */
  function initBackdrop() {
    if (!document.body.classList.contains('page-home')) return;
    var on = null;
    function onScroll() {
      var past = window.scrollY > window.innerHeight * 0.5;
      if (past !== on) {
        document.body.classList.toggle('past-hero', past);
        on = past;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  function boot() {
    initMenu();
    initReveal();
    initTransitions();
    initHeader();
    initBackdrop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
