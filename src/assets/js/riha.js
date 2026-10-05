/**
 * RIHA — motion and small storefront touches on top of the Raed starter.
 * Plain browser JS; no dependency on Salla's internals beyond `salla.event`.
 *
 * - Reveal on scroll: `.rv` blocks fade/slide their children in; `.reveal` frames open like a curtain.
 * - Parallax: `[data-parallax]` images drift slowly while scrolling.
 * - Header: hides on scroll down, returns on scroll up (body.riha-autohide).
 * - Search button: opens Salla's search modal.
 * - Product page: turns description lines like "الافتتاحية: فانيليا" into the notes pyramid.
 */
(function () {
  const doc = document;
  const body = doc.body;
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motion = body.classList.contains('riha-motion') && !reduce && 'IntersectionObserver' in window;

  /* ---------- reveal on scroll ---------- */
  function reveals(root) {
    const els = (root || doc).querySelectorAll('.rv:not(.in), .reveal:not(.in)');
    if (!motion) { els.forEach(el => el.classList.add('in')); return; }
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const t = e.target;
      if (t._rihaReveal) t._rihaReveal.classList.add('in');
      if (t.classList.contains('rv') || !t._rihaReveal) t.classList.add('in');
      io.unobserve(t);
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(el => {
      // clip-path hides .reveal frames from the observer, so watch their parent instead
      if (el.classList.contains('reveal') && el.parentElement) { el.parentElement._rihaReveal = el; io.observe(el.parentElement); }
      else io.observe(el);
    });
    // safety net: never leave content hidden if something goes wrong
    setTimeout(() => (root || doc).querySelectorAll('.rv:not(.in), .reveal:not(.in)').forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in');
    }), 2500);
  }

  /* ---------- parallax ---------- */
  function parallax() {
    const els = [...doc.querySelectorAll('[data-parallax]')];
    if (!els.length || !motion) return;
    let ticking = false;
    const tick = () => {
      ticking = false;
      els.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const img = el.querySelector('img');
        if (!img) return;
        const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        img.style.transform = `translateY(${p * -(+el.dataset.parallax || 60) * 0.6}px) scale(1.12)`;
      });
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(tick); } }, { passive: true });
    tick();
  }

  /* ---------- header hides on scroll down ---------- */
  function autohide() {
    if (!body.classList.contains('riha-autohide')) return;
    let last = scrollY;
    addEventListener('scroll', () => {
      const y = scrollY;
      const busy = body.classList.contains('menu-opened') || body.classList.contains('modal-is-open');
      body.classList.toggle('riha-header-hidden', y > last && y > 320 && !busy);
      last = y;
    }, { passive: true });
  }

  /* ---------- search ---------- */
  function search() {
    doc.addEventListener('click', e => {
      if (!e.target.closest('[data-riha-search]')) return;
      e.preventDefault();
      const modal = doc.querySelector('salla-search:not([inline])');
      if (modal && typeof modal.open === 'function') modal.open();
      else if (window.salla) salla.event.dispatch('search::open');
    });
  }

  /* ---------- notes pyramid on the product page ---------- */
  const TIERS = [
    ['الافتتاحية', /^(?:\s*)(الافتتاحية|المقدمة|النفحات العليا|Top(?: notes?)?|Notes de tête)\s*[:：\-–]\s*(.+)$/i],
    ['القلب', /^(?:\s*)(القلب|قلب العطر|النفحات الوسطى|Heart(?: notes?)?|Middle(?: notes?)?|Notes de cœur)\s*[:：\-–]\s*(.+)$/i],
    ['القاعدة', /^(?:\s*)(القاعدة|قاعدة العطر|النفحات الأساسية|Base(?: notes?)?|Notes de fond)\s*[:：\-–]\s*(.+)$/i]
  ];
  function pyramid() {
    const box = doc.querySelector('[data-riha-pyramid]');
    const desc = doc.querySelector('.product__description article');
    if (!box || !desc) return;
    const found = [];
    // look at each block-level line of the description
    desc.querySelectorAll('p, li, div, h3, h4, span').forEach(node => {
      if (node.children.length && node.querySelector('p, li, div')) return; // only leaf-ish blocks
      const text = (node.textContent || '').trim();
      TIERS.forEach(([label, re], i) => {
        if (found[i]) return;
        const m = text.match(re);
        if (m) found[i] = { label, value: m[2].trim(), node };
      });
    });
    if (found.filter(Boolean).length < 2) return;
    found.forEach(f => {
      if (!f) return;
      box.insertAdjacentHTML('beforeend', `<div class="riha-tier"><small>${f.label}</small><b></b></div>`);
      box.lastElementChild.querySelector('b').textContent = f.value;
      f.node.classList.add('riha-note-source');
    });
    box.hidden = false;
  }

  function start() {
    body.classList.add('riha-ready');
    reveals(); parallax(); autohide(); search(); pyramid();
    // sections rendered later by Salla components (sliders, lists) get revealed too
    if ('MutationObserver' in window && motion) {
      let t;
      new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => reveals(), 120); })
        .observe(doc.getElementById('main-content') || body, { childList: true, subtree: true });
    }
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start); else start();
})();
