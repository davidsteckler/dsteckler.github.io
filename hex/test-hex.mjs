import {chromium} from 'playwright';import {spawn} from 'node:child_process';import assert from 'node:assert/strict';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),origin='http://127.0.0.1:8792';let browser;const server=spawn('python3',['-m','http.server','8792','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
try{
 for(let i=0;i<60;i++){try{await fetch(origin);break;}catch{await new Promise(r=>setTimeout(r,100));}}
 browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||undefined,args:['--no-sandbox']});const context=await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await context.addInitScript(()=>{window.EyeDropper=class{async open(){return {sRGBHex:'#345678'};}};});
 await page.goto(origin+'/hex');await page.waitForURL('**/hex/');assert.equal(await page.locator('.swatch').count(),48);
 await page.getByRole('button',{name:'Select #ff6b6b',exact:true}).click();await page.locator('#copyHex').click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'#ff6b6b');assert.equal(await page.locator('#copyStatus').innerText(),'Copied #ff6b6b');
 await page.locator('#copyCommand').click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'color("#ff6b6b")');
 await page.locator('#hexInput').fill('abc');await page.locator('#copyHex').click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'#aabbcc');
 await page.locator('#hexInput').fill('#xyz');assert(await page.locator('#copyHex').isDisabled());assert(await page.locator('#hexError').isVisible());
 await page.locator('#colorPicker').evaluate(el=>{el.value='#102a43';el.dispatchEvent(new Event('input',{bubbles:true}));});assert.equal(await page.locator('#hexInput').inputValue(),'#102a43');assert.equal(await page.locator('#colorPreview').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(16, 42, 67)');
 await page.reload();assert.equal(await page.locator('#hexInput').inputValue(),'#102a43');
 await page.locator('#eyedropper').click();assert.equal(await page.locator('#hexInput').inputValue(),'#345678');
 await page.evaluate(()=>{window.EyeDropper=class{async open(){throw new DOMException('Canceled','AbortError');}};});await page.locator('#eyedropper').click();assert.equal(await page.locator('#hexInput').inputValue(),'#345678');assert.match(await page.locator('#eyedropperHint').innerText(),/Canceled/);
 await page.locator('#hexInput').fill('#000000');await page.getByRole('button',{name:'Sharp pixels',exact:true}).click();
 async function colors(){return page.locator('#pixelOriginal').evaluate(el=>{const d=el.getContext('2d').getImageData(0,0,88,32).data;const set=new Set();let colored=0;for(let i=0;i<d.length;i+=4){set.add([d[i],d[i+1],d[i+2]].join(','));if(d[i]!==d[i+1]||d[i+1]!==d[i+2])colored++;}return {count:set.size,colored};});}
 assert.equal((await colors()).count,2);await page.getByRole('button',{name:'Smooth edges',exact:true}).click();assert((await colors()).count>2);assert.equal((await colors()).colored,0);
 await page.getByRole('button',{name:'RGB smoothing',exact:true}).click();assert((await colors()).colored>0);
 await page.locator('#pixelMagnified').focus();await page.keyboard.press('Enter');assert.match(await page.locator('#pixelReadout').innerText(),/#[0-9a-f]{6}/);assert(!await page.locator('#usePixel').isDisabled());await page.locator('#usePixel').click();
 await page.screenshot({path:'/tmp/hex-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert(await page.locator('#copyHex').isVisible());await page.screenshot({path:'/tmp/hex-mobile.png',fullPage:true});
 await page.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw Error('blocked');};document.execCommand=()=>false;});await page.locator('#copyHex').click();assert.match(await page.locator('#copyStatus').innerText(),/Ctrl\+C/);assert.equal(await page.locator('#hexInput').evaluate(el=>el.selectionEnd-el.selectionStart),7);
 assert.deepEqual(errors,[]);console.log('PASS 48 palette colors, clipboard includes #, command copy, shorthand, validation, picker, persistence, fallback and mobile layout');
}finally{await browser?.close();server.kill();}
