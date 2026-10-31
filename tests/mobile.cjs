// npm install && npx playwright install chromium && npm run test:mobile
// CHROMIUM_EXECUTABLE_PATH can select an existing local Chromium binary.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURI(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
  try {
    const bytes = fs.readFileSync(file);
    res.setHeader('Content-Type', file.endsWith('.html') ? 'text/html' : file.endsWith('.mp4') ? 'video/mp4' : file.endsWith('.webp') ? 'image/webp' : 'application/octet-stream');
    if (req.headers.range) {
      const [,a,b] = /bytes=(\d+)-(\d*)/.exec(req.headers.range);
      const start=Number(a), end=b?Number(b):bytes.length-1;
      res.writeHead(206, {'Content-Range':`bytes ${start}-${end}/${bytes.length}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});
      res.end(bytes.subarray(start,end+1));
    } else { res.setHeader('Accept-Ranges','bytes'); res.end(bytes); }
  } catch { res.writeHead(404); res.end(); }
});
const wait = ms => new Promise(r => setTimeout(r, ms));
async function until(fn, label) {
  for (let i = 0; i < 80; i++) { if (await fn()) return; await wait(100); }
  throw Error(label);
}
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  try {
    const sizes = process.env.TEST_SIZE ? [process.env.TEST_SIZE.split('x').map(Number)] : [[320,568], [390,844], [430,932], [844,390], [768,1024], [1024,768], [1440,900]];
    for (const motion of (process.env.TEST_MOTION ? [process.env.TEST_MOTION] : ['reduce', 'no-preference'])) for (const [width,height] of sizes) {
      const mobile = width <= 1024;
      const context = await browser.newContext({viewport:{width,height},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1,reducedMotion:motion});
      const page = await context.newPage(), errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.addInitScript(() => {
        window.__testVideos = [];
        const create = document.createElement.bind(document);
        document.createElement = (...args) => { const el = create(...args); if (args[0] === 'video') window.__testVideos.push(el); return el; };
      });
      await page.goto(`http://127.0.0.1:${server.address().port}`,{waitUntil:'domcontentloaded'});
      await page.waitForFunction(() => document.querySelectorAll('.fcard').length === 7);
      await page.waitForFunction(() => ![...document.body.children].some(e=>e.style.zIndex==='200'));
      await page.locator('#menuBtn').click();
      assert.equal(await page.locator('#menuPanel').evaluate(e=>e.hidden),false);
      await page.locator('#menuBtn').click();
      assert.equal(await page.locator('#menuPanel').evaluate(e=>e.hidden),true);
      await page.locator('#why').scrollIntoViewIfNeeded();
      await until(() => page.locator('#why').evaluate(e => e.classList.contains('flown')), 'why did not enter');
      if (!mobile && motion !== 'reduce') await wait(4500);
      for (let i=0;i<4;i++) {
        const control = mobile ? page.locator('.ktag').nth(i) : page.locator(`.kfly[data-i="${i}"] figure`);
        if (mobile) {
          await control.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
          await wait(motion==='reduce'?0:1800);
          let r;
          await until(async()=>{ r=await control.boundingBox();return r && r.width>40 && r.height>40; },'pill must finish appearing');
          assert(await control.evaluate((e,p)=>e.contains(document.elementFromPoint(p.x,p.y)),{x:r.x+r.width/2,y:r.y+r.height/2}),'pill center must accept touch');
          await page.touchscreen.tap(r.x+r.width/2,r.y+r.height/2);
        } else {
          await control.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
          const r=await control.boundingBox();
          const point={x:r.x+r.width/2,y:r.y+r.height/2};
          assert(await control.evaluate((e,p)=>e.contains(document.elementFromPoint(p.x,p.y)),point),'card center must accept clicks');
          await page.mouse.click(point.x,point.y);
        }
        await until(() => page.locator('#why').evaluate(e => e.classList.contains('detail')), 'detail did not open');
        assert((await page.locator('#kdText').textContent()).length > 30);
        if (motion === 'reduce') {
          assert.equal(await page.locator('#kdViz animateMotion').count(),0);
          for (const opacity of await page.locator('.kv-tile').evaluateAll(es => es.map(e => getComputedStyle(e).opacity))) assert.equal(opacity,'1');
          for (const offset of await page.locator('.kv-path').evaluateAll(es => es.map(e => getComputedStyle(e).strokeDashoffset))) assert.equal(offset,'0px');
        }
        if(process.env.SCREENSHOT_DIR && width===390 && i===3) {
          await wait(motion==='reduce'?0:700);
          await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,`detail-${motion}.png`)});
        }
        await page.locator('#kdBack').click();
        assert.equal(await control.evaluate(e=>e===document.activeElement),true);
      }
      if(!mobile) {
        // Desktop launch state must not hide the controls after a narrow resize.
        await page.setViewportSize({width:390,height:844});
        await page.locator('.ktag').first().evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
        await wait(900);
        assert.equal(await page.locator('.ktags').evaluate(e=>getComputedStyle(e).opacity),'1');
        const r=await page.locator('.ktag').first().boundingBox();
        await page.mouse.click(r.x+r.width/2,r.y+r.height/2);
        assert.equal(await page.locator('#why').evaluate(e=>e.classList.contains('detail')),true);
        await page.locator('#kdBack').click();
        await page.setViewportSize({width,height});
      }
      await page.locator('#reel').scrollIntoViewIfNeeded();
      if (motion !== 'reduce') await page.locator('#playCut').click();
      const start = await page.locator('#npTitle').textContent();
      await page.locator('#nextCut').click();
      assert.notEqual(await page.locator('#npTitle').textContent(),start);
      await page.locator('#prevCut').click();
      assert.equal(await page.locator('#npTitle').textContent(),start);
      if(width===390 && motion==='reduce') {
        await page.locator('#playCut').click();
        await until(()=>page.locator('#npTitle').textContent().then(t=>t!==start),'explicit resume should advance even with reduced motion');
        await page.locator('#playCut').click();
        // Restore the original selection before checking swipe direction.
        await page.locator('#prevCut').click();
      }
      // Exercise real touch events, including the browser's generated click after a swipe.
      if (mobile) {
        await page.locator('#fan').scrollIntoViewIfNeeded(); await wait(800);
        const box=await page.locator('#fan').boundingBox(), x=box.x+box.width/2,y=box.y+100;
        const cdp=await context.newCDPSession(page);
        await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
        for(let d=20;d<=100;d+=20) await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-d,y}]});
        await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
        await wait(100);
        assert.notEqual(await page.locator('#npTitle').textContent(),start,'swipe should navigate');
        assert.equal(await page.locator('#player').evaluate(e=>e.hidden),true,'swipe must not open a video');
      }
      for(let i=1;i<4;i++) {
        await page.locator(`#ctab${i}`).click();
        await until(()=>page.locator(`#case${i}`).evaluate(e=>e.classList.contains('on')),'case did not switch');
        await page.locator(`#case${i}`).evaluate(async e=>{
          await Promise.all(e.getAnimations().map(a=>a.finished.catch(()=>{})));
          await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
        });
      }
      if(!mobile) {
        await page.locator('.case-stage').evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
        const r=await page.locator('.case-stage').boundingBox();
        await page.mouse.move(r.x+r.width*.7,r.y+r.height*.4);
        if(motion!=='reduce') await until(()=>page.locator('.case-stage').evaluate(e=>e.style.getPropertyValue('--mx')!==''),'desktop mouse tilt must respond');
        else assert.equal(await page.locator('.case-stage').evaluate(e=>e.style.getPropertyValue('--mx')),'');
      }
      await page.locator('#watchCut').click();
      assert.equal(await page.locator('#player').evaluate(e=>e.hidden),false);
      await page.locator('#playerClose').click();
      await page.locator('#svcInfo').scrollIntoViewIfNeeded();
      await until(()=>page.evaluate(()=>window.__testVideos.some(v=>v.readyState>=2)),'clip did not decode');
      if(motion==='reduce') {
        await until(()=>page.evaluate(()=>window.__testVideos.some(v=>v.currentTime>0 && v.paused)),'reduced-motion still must seek after metadata');
      } else {
        assert(await page.evaluate(()=>window.__testVideos.some(v=>!v.paused)),'active clip must play');
      }
      // Every silent local clip must decode; sound uses the generated equalizer.
      const clips = ['edit','motion','vfx','color',null,'trailer'];
      for(let i=0;i<6;i++) {
        const service=page.locator('.svc').nth(i);
        await service.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
        let point;
        await until(async()=>{
          point=await service.evaluate(e=>{
            const r=e.getBoundingClientRect();
            for(const fy of [.5,.3,.7,.15,.85]) for(const fx of [.5,.3,.7,.15,.85]) {
              const x=r.x+r.width*fx,y=r.y+r.height*fy;
              if(x>0 && x<innerWidth && y>80 && y<innerHeight && e.contains(document.elementFromPoint(x,y)))return {x,y};
            }
          });return !!point;
        },'service must have a reachable hit target '+i);
        if(mobile) await page.touchscreen.tap(point.x,point.y); else await page.mouse.click(point.x,point.y);
        await until(()=>page.locator('#svcInfo').getAttribute('data-k').then(x=>x===String(i)),'service selection failed '+i);
        await page.locator('#svcInfo').scrollIntoViewIfNeeded();
        if(clips[i]) await until(()=>page.evaluate(name=>window.__testVideos.some(v=>v.src.endsWith('/'+name+'.mp4') && v.readyState>=2),clips[i]),'clip did not decode '+clips[i]);
        assert(await page.evaluate(()=>window.__testVideos.every(v=>v.muted && v.playsInline)));
        assert(await page.evaluate(()=>window.__testVideos.filter(v=>!v.paused).length<=1));
        await wait(motion==='reduce'?600:1800);
        if(width===768 && motion!=='reduce' && i===0) {
          await page.mouse.move(1,1);  // leaving the wheel must not erase its focus pause
          await wait(3300);           // cross an entire auto-advance interval
        }
        assert.equal(await page.locator('#svcInfo').getAttribute('data-k'),String(i),'focus must hold the selected service while reading its preview');
        if(motion!=='reduce' && clips[i]) await until(()=>page.evaluate(name=>window.__testVideos.some(v=>v.src.endsWith('/'+name+'.mp4') && v.currentTime>0 && !v.paused),clips[i]),'clip time must advance '+clips[i]);
        await until(()=>page.locator('.svcdots').evaluate(e=>{const d=e.getContext('2d').getImageData(0,0,e.width,e.height).data;for(let k=3;k<d.length;k+=4)if(d[k])return true;return false;}),'LED screen must contain visible pixels for service '+i);
      }
      if(motion!=='reduce') {
        // Simulate the visibility lifecycle signal; this is separate from real OS backgrounding.
        await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
        assert(await page.evaluate(()=>window.__testVideos.every(v=>v.paused)),'hidden document must pause media');
        await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
        await until(()=>page.evaluate(()=>window.__testVideos.some(v=>!v.paused)),'visible document must resume active media');
      }
      if(process.env.SCREENSHOT_DIR && width===390){await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,`services-${motion}.png`)});}
      await page.locator('#contact').scrollIntoViewIfNeeded();
      await until(()=>page.evaluate(()=>window.__testVideos.every(v=>v.paused)),'offscreen clip must pause');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'horizontal page overflow');
      assert.deepEqual(errors,[]);
      const output=process.env.SCREENSHOT_DIR;
      if(output && width===390) { fs.mkdirSync(output,{recursive:true}); await page.locator('#why').scrollIntoViewIfNeeded(); await page.screenshot({path:path.join(output,`mobile-${motion}.png`)}); }
      console.log(`PASS ${width}x${height} ${motion}`);
      await context.close();
    }
  } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
