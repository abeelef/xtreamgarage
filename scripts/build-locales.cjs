const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {load}=require('cheerio');
const context={window:{}};vm.runInNewContext(fs.readFileSync('assets/translations.js','utf8'),context);
const dictionaries=context.window.translations;
const origin=process.env.SITE_URL?.replace(/\/$/,'');
if(origin && !/^https:\/\/[^/]+$/.test(origin))throw Error('SITE_URL must be the confirmed https origin without a path');
const files=fs.readdirSync('.').filter(f=>f.endsWith('.html'));
const urls=[];
for(const file of files){
 const source=fs.readFileSync(file,'utf8');
 for(const lang of ['es','ca','en']){
  const $=load(source);const prefix=lang==='es'?'':'../';const route=(l,f=file)=>`${l==='es'?'':l+'/'}${f}`;
  $('[data-generated-seo],.language-links').remove();$('html').attr('lang',lang);
  const t=text=>dictionaries[lang]?.[text.replace(/\s+/g,' ').trim()]||text;
  if(lang!=='es'){
   function walk(node){if(['script','style'].includes(node.name))return;
    if(node.type==='text'){const old=node.data;const translated=t(old);if(translated!==old)node.data=old.match(/^\s*/)[0]+translated+old.match(/\s*$/)[0];}
    else for(const child of node.children||[])walk(child);
   }walk($.root()[0]);
   $('*').each((_,el)=>{for(const attr of ['alt','aria-label','placeholder'])if($(el).attr(attr))$(el).attr(attr,t($(el).attr(attr)));});
   $('meta[name="description"],meta[property="og:title"],meta[property="og:description"]').each((_,el)=>$(el).attr('content',t($(el).attr('content'))));
   $('[src],[href],[poster],[data-optional-src],[data-video-src]').each((_,el)=>{
    for(const attr of ['src','href','poster','data-optional-src','data-video-src']){
     let v=$(el).attr(attr);if(!v || /^(?:https?:|data:|tel:|#|mailto:)/.test(v))continue;
     if(attr==='href' && /\.html(?:#.*)?$/.test(v))continue;
     $(el).attr(attr,prefix+v.replace(/^\.\//,''));
    }
   });
   $('[onclick],[style]').each((_,el)=>{for(const attr of ['onclick','style'])if($(el).attr(attr))$(el).attr(attr,$(el).attr(attr).replace(/(['"])img\//g,'$1../img/'));});
  }
  $('#language-select').val(lang);
  $('#language-select').after('<nav class="language-links" aria-label="Languages">'+['es','ca','en'].map(l=>`<a href="${prefix+route(l)}" lang="${l}" hreflang="${l}" ${l===lang?'aria-current="page"':''}>${l.toUpperCase()}</a>`).join('')+'</nav>');
  // Native links also work without JavaScript; select is a compact progressive enhancement.
  $('.language-links').attr('style','display:none');$('head').append('<noscript data-generated-seo><style>.language-links{display:flex!important}#language-select{display:none}</style></noscript>');
  $('meta[property="og:locale"]').attr('content',{es:'es_ES',ca:'ca_ES',en:'en_GB'}[lang]);
  const canonical=(origin?origin+'/':prefix)+route(lang);
  $('head').append(`<link data-generated-seo rel="canonical" href="${canonical}">`);
  if(origin){
   for(const l of ['es','ca','en'])$('head').append(`<link data-generated-seo rel="alternate" hreflang="${l}" href="${origin}/${route(l)}">`);
   $('head').append(`<link data-generated-seo rel="alternate" hreflang="x-default" href="${origin}/${file}"><meta data-generated-seo property="og:url" content="${canonical}"><meta data-generated-seo property="og:image" content="${origin}/img/logo-xtream-detailing-perfil.webp">`);
  }
  if(file==='index.html')$('head').append('<script data-generated-seo type="application/ld+json">'+JSON.stringify({'@context':'https://schema.org','@type':'AutomotiveBusiness',name:'Xtream Detailing',telephone:'+34637551480',address:{'@type':'PostalAddress',streetAddress:'Carrer Gran Bretanya, 6',postalCode:'08700',addressLocality:'Igualada',addressRegion:'Barcelona',addressCountry:'ES'},...(origin?{url:origin}: {})})+'</script>');
  const out=route(lang);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,$.html());urls.push(out);
 }
}
fs.writeFileSync('robots.txt','User-agent: *\nAllow: /\n'+(origin?`Sitemap: ${origin}/sitemap.xml\n`:''));
if(origin)fs.writeFileSync('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(u=>`<url><loc>${origin}/${u}</loc></url>`).join('')+'</urlset>');
if(!origin && fs.existsSync('sitemap.xml'))fs.unlinkSync('sitemap.xml');
console.log(`Built ${urls.length} pages. Absolute SEO URLs ${origin?'enabled':'pending confirmed SITE_URL'}.`);
