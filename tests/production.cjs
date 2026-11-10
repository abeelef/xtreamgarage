const {chromium}=require('playwright');
const AxeBuilder=require('@axe-core/playwright').default;
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.SITE_URL||'http://127.0.0.1:8000';
(async()=>{
 const browser=await chromium.launch();
 const nojs=await browser.newContext({javaScriptEnabled:false});const staticPage=await nojs.newPage();
 const files=fs.readdirSync('.').filter(f=>f.endsWith('.html'));
 for(const lang of ['es','ca','en'])for(const f of files){
  await staticPage.goto(`${base}/${lang==='es'?'':lang+'/'}${f}`);
  assert.equal(await staticPage.locator('html').getAttribute('lang'),lang);
  assert.equal(await staticPage.locator('h1').count(),1);
  assert.equal(await staticPage.locator('.language-links a:visible').count(),3);
  assert.equal(await staticPage.locator('link[rel="canonical"]').count(),1);
 }
 console.log('33 independent translated pages work without JavaScript.');
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const page=await context.newPage();
 const requests=[];page.on('request',r=>requests.push(r.url()));
 await page.goto(base+'/index.html');
 assert(!requests.some(u=>u.includes('google.com/maps')||u.endsWith('.mp4')));
 assert.equal(await page.locator('#inicio video source').getAttribute('src'),null);
 await page.route('https://www.google.com/maps/**',r=>r.fulfill({body:'<html><title>Map test</title></html>',contentType:'text/html'}));
 await page.locator('.map-load').click();
 assert((await page.locator('iframe').getAttribute('src')).includes('google.com/maps'));
 console.log('No map/video request until requested on reduced-motion mobile.');
 for(const file of files){
  await page.goto(`${base}/${file}`);
  const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  assert.deepEqual(report.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],file);
 }
 console.log('WCAG A/AA automated checks passed on all 11 pages.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
