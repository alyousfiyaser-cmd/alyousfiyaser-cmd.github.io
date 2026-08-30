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
