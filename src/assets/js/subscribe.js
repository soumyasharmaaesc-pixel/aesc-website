/* Athena · form confirmations + LinkedIn newsletter capture.
   Replace LINKEDIN_NEWSLETTER with the live newsletter URL and everything downstream updates. */
(function () {
  'use strict';

  var LINKEDIN_NEWSLETTER = 'https://www.linkedin.com/newsletters/the-brief-7470101303818452992/';

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var toast, timer;

  function ensureToast() {
    if (toast) return toast;
    toast = document.createElement('div');
    toast.className = 'subx-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML =
      '<span class="subx-ic" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" ' +
        'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
        '<polyline points="20 6 9 17 4 12"/></svg>' +
      '</span>' +
      '<span class="subx-body"><strong></strong><em></em>' +
        '<a class="subx-cta" target="_blank" rel="noopener">' +
          '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">' +
          '<path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.76-2.05 4.02 0 4.76 2.6 4.76 5.98V21h-4v-5.3c0-1.27-.02-2.9-1.8-2.9-1.8 0-2.07 1.38-2.07 2.8V21H9z"/></svg>' +
          '<span>Subscribe to The Brief</span>' +
        '</a>' +
      '</span>' +
      '<button type="button" class="subx-x" aria-label="Dismiss">&#215;</button>';
    document.body.appendChild(toast);
    toast.querySelector('.subx-x').addEventListener('click', hide);
    toast.querySelector('.subx-cta').addEventListener('click', function () {
      setTimeout(hide, 250);
    });
    return toast;
  }

  function show(title, body, opts) {
    opts = opts || {};
    var t = ensureToast();
    t.querySelector('strong').textContent = title;
    t.querySelector('em').textContent = body;

    var cta = t.querySelector('.subx-cta');
    var wantCta = opts.cta !== false && !!LINKEDIN_NEWSLETTER;
    cta.style.display = wantCta ? '' : 'none';
    if (wantCta) cta.href = LINKEDIN_NEWSLETTER;

    t.classList.toggle('is-error', !!opts.error);
    void t.offsetWidth;
    t.classList.add('is-on');
    clearTimeout(timer);
    timer = setTimeout(hide, opts.error ? 4200 : (wantCta ? 9000 : 5600));
  }
  function hide() { if (toast) toast.classList.remove('is-on'); }

  /* Public: page-level mailto handlers call this after firing their mail client. */
  window.AthenaConfirm = show;

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || !form.classList || !form.classList.contains('ft-form')) return;
    e.preventDefault();

    var field = form.querySelector('input[type="email"]');
    var value = field ? field.value.trim() : '';

    if (!EMAIL.test(value)) {
      show('Check that address', 'That email does not look quite right. Mind trying again?',
           { error: true, cta: false });
      if (field) { field.focus(); field.select && field.select(); }
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Adding you'; }

    setTimeout(function () {
      show('You are on the list',
           LINKEDIN_NEWSLETTER
             ? 'One more step. Subscribe to The Brief on LinkedIn and every edition lands in your feed.'
             : 'Athena insights will land in ' + value + '. No noise, no weekly filler.');
      form.reset();
      if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Subscribe'; }
    }, 380);
  }, false);

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
})();
