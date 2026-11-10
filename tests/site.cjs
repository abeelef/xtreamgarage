const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const base = process.env.SITE_URL || 'http://127.0.0.1:8000';
(async () => {
  const browser = await chromium.launch({headless:true});
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  const selectLanguage = async lang => { await Promise.all([page.waitForURL(url => lang === 'es' ? !/\/(ca|en)\//.test(url.pathname) : url.pathname.includes('/'+lang+'/')), page.selectOption('#language-select',lang)]); await page.waitForFunction(l => document.documentElement.lang === l,lang); };
  const errors = [];
  page.on('pageerror',e => errors.push(e.message));
  // Third-party map and background video are not part of the booking/navigation checks.
  await page.route('**/*.mp4',r=>r.abort());
  await page.route('**/maps/embed**',r=>r.abort());
  const pages = ['index','ppf','pulido','ceramico','detailing-exterior','detailing-interior-intermedio','detailing-interior-completo','limpieza-motor','tintado','galeria','vinilado'];
  for (const name of pages) {
    await page.goto(`${base}/${name}.html`,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>typeof window.t==='function');
    assert.equal(await page.locator('h1').count(),1,name);
    assert.equal(await page.locator('#services-submenu a').count(),9,name);
    const spanish = await page.locator('h1').innerText();
    await selectLanguage('en');
    assert.equal(await page.locator('html').getAttribute('lang'),'en');
    assert.equal(await page.locator('#open-sidebar').getAttribute('aria-label'),'Open menu');
    assert.notEqual(await page.locator('h1').innerText(),spanish,name);
    await selectLanguage('ca');
    assert.equal(await page.locator('#open-sidebar').getAttribute('aria-label'),'Obrir menú');
    await selectLanguage('es');
    assert.equal(await page.locator('h1').innerText(),spanish,name);
    await page.locator('#open-sidebar').click();
    await page.locator('#toggle-services').click();
    assert(await page.locator('#services-submenu').isVisible());
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#sidebar').getAttribute('aria-hidden'),'true');
    if(name==='index') {
      assert.equal(await page.locator('main #pulido, main #ppf, main #tintado').count(),0);
      assert.equal(await page.locator('[data-comparison]').count(),3);
      await page.locator('.comparison-range').first().focus();await page.keyboard.press('ArrowRight');
      assert.equal(await page.locator('.comparison-range').first().inputValue(),'51');
      assert.equal(await page.locator('.comparison-pending:visible').count(),2);
    }
    console.log('Navigation and languages:',name);
  }
  await page.goto(`${base}/en/pulido.html`);
  assert.equal(await page.locator('#pulido h3').count(),4);
  for(const [size,price] of [['Pequeño','250'],['Mediano','330'],['Grande','400'],['4x4','450']]){
    await page.locator(`#pulido button[onclick*="${size}"]`).click();
    assert.equal(await page.locator('#modal-service-price').innerText(),`From ${price} €`);
    assert.equal(await page.locator('#service-select').inputValue(),`Pulido de Pintura - ${size}|${price}`);
    await page.keyboard.press('Escape');
  }
  await page.goto(`${base}/ca/ceramico.html`);
  for (const [name,price] of [['Cerámica 2-3 años','250'],['Cerámica 6 años','450'],['Cerámica 6-7 años doble capa','550']]){
    await page.locator(`#ceramico button[onclick*="${name}"]`).first().click();
    assert.equal(await page.locator('#service-select').inputValue(),`${name}|${price}`);
    assert.equal(await page.locator('#modal-service-price').innerText(),`Des de ${price} €`);
    await page.keyboard.press('Escape');
  }
  await page.goto(`${base}/en/tintado.html`);
  await page.locator('#tab-ceramica').click();
  await selectLanguage('ca');
  assert.equal(await page.locator('.tintado-precio').first().innerText(),'194 €');
  await selectLanguage('en');
  assert.equal(await page.locator('.tintado-precio').first().innerText(),'194 €');
  await page.locator('.tintado-cita').first().click();
  assert.equal(await page.locator('#modal-service-price').innerText(),'From 194 €');
  assert.equal(await page.locator('#service-select').inputValue(),'Tintado de Lunas Lámina Nanocerámica - Pequeño|194');
  await page.locator('#quote-name').fill('Test Customer');
  await page.locator('#quote-phone').fill('600000000');
  await page.locator('#quote-vehicle').fill('Test car');
  await page.locator('#quote-year').fill('2020');
  await page.evaluate(()=>{window.open = url => {window.testMessage = url;};});
  await page.locator('#submit-btn').click();
  const message = await page.evaluate(()=>new URL(window.testMessage).searchParams.get('text'));
  assert(message.includes('QUOTE REQUEST - XTREAM DETAILING'));
  assert(message.includes('Window tinting Nanoceramic film - Small (194 €)'));
  assert(!message.includes('Garage'));
  console.log('Prices, booking selection and translated WhatsApp message: passed');
  await page.goto(`${base}/en/galeria.html`);
  for(const tile of await page.locator('#gallery-grid .tile').all()) {
    await tile.click();
    assert(await page.locator('#lightbox').isVisible());
    await page.locator('#lightbox-img').evaluate(img => img.decode());
    await page.keyboard.press('Escape');
  }
  console.log('All gallery images open: passed');
  await page.route('**/img/antesdespues/*Pulido.webp',r=>r.fulfill({path:path.resolve('img/antesdespues/antesInterior.webp'),contentType:'image/jpeg'}));
  await page.route('**/img/antesdespues/*Vinilo.webp',r=>r.fulfill({path:path.resolve('img/antesdespues/despuesInterior.webp'),contentType:'image/jpeg'}));
  await page.route('**/img/marcas/*.webp',r=>r.fulfill({path:path.resolve('img/labocosmetica-logo.webp'),contentType:'image/webp'}));
  await page.goto(`${base}/index.html`);
  await page.waitForFunction(()=>[...document.querySelectorAll('.comparison-images')].every(el=>!el.hidden));
  assert.equal(await page.locator('img[data-optional-src][src*="marcas/"]:visible').count(),3);
  console.log('Future asset uploads activate all comparators and brands: passed');
  await page.unroute('**/img/antesdespues/*Pulido.webp');
  await page.unroute('**/img/antesdespues/*Vinilo.webp');
  await page.unroute('**/img/marcas/*.webp');
  await page.setViewportSize({width:390,height:844});
  for(const name of pages) {
    await page.goto(`${base}/en/${name}.html`,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>typeof window.t==='function');
    assert(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),`Mobile overflow: ${name}`);
  }
  fs.mkdirSync('/tmp/xtream-screenshots',{recursive:true});
  await page.goto(`${base}/pulido.html`);
  await page.locator('img[src]:not([data-optional-src])').evaluateAll(imgs=>Promise.all(imgs.map(img=>{img.loading='eager';return img.decode();})));
  await page.screenshot({path:'/tmp/xtream-screenshots/pulido-mobile.png',fullPage:true});
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(`${base}/index.html`);
  await page.locator('img[src]:not([data-optional-src])').evaluateAll(imgs=>Promise.all(imgs.map(img=>{img.loading='eager';return img.decode();})));
  await page.screenshot({path:'/tmp/xtream-screenshots/home-desktop.png',fullPage:true});
  assert.deepEqual(errors,[],'JavaScript errors');
  console.log('Mobile layouts and JavaScript checks: passed');
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1);});
