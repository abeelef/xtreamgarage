(() => {
  const dictionaries = window.translations;
  let language = 'es';
  try { language = localStorage.getItem('xtream-language') || 'es'; } catch {}
  const requested = new URLSearchParams(location.search).get('lang');
  if (['es','ca','en'].includes(requested)) language = requested;
  if (!['es','ca','en'].includes(language)) language = 'es';
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  window.t = value => {
    const translated = language === 'es' ? undefined : dictionaries[language][normalize(value)];
    return translated === undefined ? value : value.match(/^\s*/)[0] + translated + value.match(/\s*$/)[0];
  };
  const originals = new WeakMap();
  const attributes = new WeakMap();
  function translate(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest('script,style,#language-select,[translate="no"]')) continue;
      const original = originals.get(node) ?? node.nodeValue;
      const key = normalize(original);
      if (!Object.hasOwn(dictionaries.ca,key) && !Object.hasOwn(dictionaries.en,key)) continue;
      originals.set(node, original);
      const translated = window.t(original);
      if (node.nodeValue !== translated) node.nodeValue = translated;
    }
    root.querySelectorAll?.('[alt],[aria-label],[placeholder],meta[name="description"],meta[property="og:description"],meta[property="og:title"]').forEach(el => {
      const original = attributes.get(el) || {};
      for (const name of ['alt','aria-label','placeholder','content']) {
        if (!el.hasAttribute(name)) continue;
        original[name] ??= el.getAttribute(name);
        el.setAttribute(name,window.t(original[name]));
      }
      attributes.set(el, original);
    });
  }
  function apply() {
    document.documentElement.lang = language;
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content',{es:'es_ES',ca:'ca_ES',en:'en_GB'}[language]);
    translate(document.documentElement);
    document.getElementById('language-select').value = language;
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
      const url = new URL(link.href);
      if (url.searchParams.has('text')) { url.searchParams.set('text',window.t('Hola, quiero más información sobre vuestros servicios')); link.href=url.href; }
    });
    // Refresh dynamic service title and price in an open booking dialog.
    const select = document.getElementById('service-select');
    if (select && !document.getElementById('quote-modal').classList.contains('hidden')) window.updateModalServiceFromSelect();
    const caption = document.getElementById('lightbox-caption');
    if (caption && !document.getElementById('lightbox').classList.contains('hidden')) window.showLightboxPhoto();
  }
  apply();
  document.getElementById('language-select').addEventListener('change',event => {
    language = event.target.value;
    try { localStorage.setItem('xtream-language',language); } catch {}
    const url = new URL(location.href); url.searchParams.set('lang',language);history.replaceState(null,'',url);
    apply();
  });
  // Carry the choice even when browser storage is unavailable.
  document.addEventListener('click',event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href,location.href);
    if (url.origin === location.origin && url.pathname.endsWith('.html')) {url.searchParams.set('lang',language);link.href=url.href;}
  });
})();
