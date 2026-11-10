// Optional assets appear automatically after the owner uploads them.
document.querySelectorAll('img[data-optional-src]').forEach(img => {
  img.addEventListener('load', () => {
    img.hidden = false;
    img.dataset.ready = 'true';
    const identity = img.closest('.brand-identity');
    if (identity) {
      identity.querySelector('.wordmark').hidden = true;
      const favicon = document.querySelector('link[rel="icon"]');
      favicon.href = img.src;
      favicon.type = 'image/png';
    }
    const comparison = img.closest('[data-comparison]');
    if (comparison && [...comparison.querySelectorAll('img')].every(photo => photo.dataset.ready)) {
      comparison.querySelector('.comparison-images').hidden = false;
      comparison.querySelector('.comparison-pending').hidden = true;
    }
  });
  img.addEventListener('error', () => { img.hidden = true; });
  img.src = img.dataset.optionalSrc;
});
document.querySelectorAll('[data-comparison] input').forEach(input => {
  input.addEventListener('input', () => input.closest('[data-comparison]').style.setProperty('--split', input.value + '%'));
});
// Keep keyboard focus inside the active menu or booking dialog.
document.addEventListener('keydown', event => {
  const modal = document.getElementById('quote-modal');
  const sidebar = document.getElementById('sidebar');
  const active = modal && !modal.classList.contains('hidden') ? modal : sidebar?.getAttribute('aria-hidden') === 'false' ? sidebar : null;
  if (!active) return;
  if (event.key === 'Escape' && active === sidebar) { closeMenu(); document.getElementById('open-sidebar').focus(); }
  if (event.key !== 'Tab') return;
  const items = [...active.querySelectorAll('a[href],button,input:not([type="hidden"]),select,textarea')].filter(el => el.getClientRects().length);
  const first = items[0], last = items.at(-1);
  if (event.shiftKey && document.activeElement === first) {event.preventDefault();last.focus();}
  else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first.focus();}
});
