(() => {
  const language = document.documentElement.lang || 'es';
  const file = location.pathname.split('/').pop() || 'index.html';
  const prefix = language === 'es' ? './' : '../';
  const destination = lang => {
    const query = new URLSearchParams(location.search); query.delete('lang');
    const film = document.querySelector('.tintado-tab[aria-selected="true"]');
    if (film) query.set('film',film.id.replace('tab-',''));
    return prefix + (lang === 'es' ? '' : lang + '/') + file + (query.size ? '?'+query : '') + location.hash;
  };
  window.t = text => window.translations[language]?.[text.trim()] || text;
  const legacy = new URLSearchParams(location.search).get('lang');
  if (['es','ca','en'].includes(legacy) && legacy !== language) {
    location.replace(destination(legacy));
    return;
  }
  const select = document.getElementById('language-select');
  select.value = language;
  select.addEventListener('change', event => { location.href = destination(event.target.value); });
})();
