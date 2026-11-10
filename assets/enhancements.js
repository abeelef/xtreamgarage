// Optional assets appear automatically after the owner uploads them.
document.querySelectorAll('img[data-optional-src]').forEach(img => {
  img.addEventListener('load', () => {
    img.hidden = false;
    img.dataset.ready = 'true';
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

// No Google request is made until the visitor explicitly loads the map.
document.querySelectorAll('.map-load').forEach(button => button.addEventListener('click', () => {
  const prompt = button.closest('.map-prompt');
  const frame = prompt.parentElement.querySelector('iframe');
  frame.src = frame.dataset.mapSrc;
  frame.hidden = false;
  prompt.remove();
}));
const backgroundVideo = document.querySelector('#inicio video');
const videoButton = document.querySelector('.video-toggle');
if (backgroundVideo && videoButton) {
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const setVideoState = () => {
    videoButton.textContent = window.t(backgroundVideo.paused ? 'Reproducir vídeo' : 'Pausar vídeo');
    videoButton.setAttribute('aria-pressed', String(!backgroundVideo.paused));
  };
  const playVideo = async () => {
    if (!backgroundVideo.querySelector('source').src) {
      backgroundVideo.querySelectorAll('source').forEach(source => { source.src = source.dataset.videoSrc; });
      backgroundVideo.load();
    }
    try { await backgroundVideo.play(); } catch { setVideoState(); }
  };
  backgroundVideo.addEventListener('play',setVideoState);
  backgroundVideo.addEventListener('pause',setVideoState);
  videoButton.addEventListener('click',() => backgroundVideo.paused ? playVideo() : backgroundVideo.pause());
  motionPreference.addEventListener('change',event => { if(event.matches) backgroundVideo.pause(); });
  document.addEventListener('visibilitychange',() => { if(document.hidden) backgroundVideo.pause(); });
  // Mobile and reduced-data users keep the lightweight poster until they choose play.
  if (!motionPreference.matches && !navigator.connection?.saveData && matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('load',playVideo,{once:true});
  }
}
