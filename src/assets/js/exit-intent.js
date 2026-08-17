/* Athena — exit-intent panel. Minimal, once per session. */
(function () {
  'use strict';
  var KEY = 'aesc_exit_seen';
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}
  if (document.body && /contact-us/.test(location.pathname)) return; // don't nag on the contact page

  var shown = false, el = null, lastFocus = null, armed = false;

  function build() {
    el = document.createElement('div');
    el.className = 'xi';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'xi-t');
    el.innerHTML =
      '<div class="xi-scrim" data-xi-close></div>' +
      '<div class="xi-panel">' +
        '<button class="xi-x" type="button" aria-label="Close" data-xi-close>&#215;</button>' +
        '<span class="xi-eyebrow">Before you go</span>' +
      '<h2 class="xi-title" id="xi-t">The leader you need <em>isn&rsquo;t</em> looking for a job.</h2>' +
      '<p class="xi-sub">The best are employed, discreet and never answer a job post. Reaching them is the whole job.</p>' +
      '<span class="xi-meta">Partner-led &middot; Confidential &middot; Reply within a day</span>' +
      '<a class="xi-cta" href="contact-us.html">Start a confidential conversation <span aria-hidden="true">&#8594;</span></a>' +
      '</div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-xi-close')) close();
    });
  }

  function show() {
    if (shown) return;
    shown = true;
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    if (!el) build();
    lastFocus = document.activeElement;
    void el.offsetHeight; // force reflow so the transition runs
    el.classList.add('on');
    var cta = el.querySelector('.xi-cta');
    if (cta) cta.focus();
    document.addEventListener('keydown', onKey);
  }

  function close() {
    if (!el) return;
    el.classList.remove('on');
    document.removeEventListener('keydown', onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function onKey(e) { if (e.key === 'Escape') close(); }

  // Arm only after the visitor has actually engaged (3s), so it never fires on a bounce.
  setTimeout(function () { armed = true; }, 3000);

  // 1. Desktop exit intent: cursor leaves through the top of the viewport.
  document.addEventListener('mouseout', function (e) {
    if (!armed || shown) return;
    if (e.relatedTarget || e.toElement) return;
    if (e.clientY > 6) return;
    show();
  });

  // 2. Tab switch / window blur: fire when the page is hidden, so it is waiting on return.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && armed && !shown) show();
  });


  // 4. Hover on the "Know More" partnership button. Fires once per session, so a
  //    second hover leaves the button clickable rather than re-opening the panel
  //    every time the cursor crosses it.
  document.addEventListener('mouseover', function (e) {
    if (!armed || shown) return;
    var t = e.target;
    if (!t || !t.closest) return;
    if (!t.closest('.thh-learn-more')) return;
    show();
  });

  // 3. Back navigation: catch the first back press.
  try {
    history.pushState({ xi: 1 }, '', location.href);
    window.addEventListener('popstate', function () {
      if (!armed || shown) return;
      show();
      history.pushState({ xi: 1 }, '', location.href);
    });
  } catch (e) {}
})();
