const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('C:/Users/MY/Doubao/chats/2026-10-09/new-chat/frontend-agent/node_modules/playwright-core');
const sharp = require('../node_modules/sharp');

const root = path.resolve(__dirname, '..');
const mediaDir = path.join(root, 'public/media/community-drama');
const outDir = path.join(__dirname, 'drama-frames');
const sourceDir = 'D:/微信缓存/xwechat_files/wxid_6kgpozufb3eu22_c0c6/temp/RWTemp/2026-11/c98b3a5832c47a2ec78736179e6f57a3';
const filenames = ['fc44db31eef30fef09d97b47141eac93.mp4', 'fd28a775b1082626e089148b7a6bf133.mp4', '8b1d87b9e008a11fffc89f00bbbc9ff4.mp4', '9fec4829cd6e7e9cc29b04627640680c.mp4'];

(async () => {
  await fs.mkdir(mediaDir, {recursive:true});
  await fs.mkdir(outDir, {recursive:true});
  for (let i=0; i<filenames.length; i++) await fs.copyFile(path.join(sourceDir,filenames[i]),path.join(mediaDir,`film-${String(i+1).padStart(2,'0')}.mp4`));
  const server = http.createServer(async (req,res)=>{
    if(req.url==='/') {res.writeHead(200,{'Content-Type':'text/html'});res.end('<html><body></body></html>');return;}
    const m = req.url.match(/^\/film-(\d\d)\.mp4$/);
    if (!m) {res.writeHead(404);res.end();return;}
    const buf=await fs.readFile(path.join(mediaDir,`film-${m[1]}.mp4`));
    const range=req.headers.range?.match(/bytes=(\d+)-(\d*)/);
    if (range) {const start=Number(range[1]);const end=range[2]?Math.min(Number(range[2]),buf.length-1):buf.length-1;res.writeHead(206,{'Content-Type':'video/mp4','Accept-Ranges':'bytes','Content-Range':`bytes ${start}-${end}/${buf.length}`,'Content-Length':end-start+1});res.end(buf.subarray(start,end+1));}
    else {res.writeHead(200,{'Content-Type':'video/mp4','Accept-Ranges':'bytes','Content-Length':buf.length});res.end(buf);}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser = await chromium.launch({headless:true,executablePath:'C:/Users/MY/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe'});
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  const metadata=[];
  for(let i=0; i<filenames.length; i++) {
    const id=`film-${String(i+1).padStart(2,'0')}`;
    const result=await page.evaluate(async({id})=>{
      const v=document.createElement('video');v.muted=true;v.preload='auto';document.body.appendChild(v);
      await new Promise((resolve,reject)=>{v.onloadeddata=resolve;v.onerror=()=>reject(new Error('Video error '+v.error?.message));v.src=`/${id}.mp4`;});
      const width=v.videoWidth,height=v.videoHeight,duration=v.duration;
      const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');
      const frames=[];
      for(const fraction of [0.05,0.2,0.35,0.5,0.65,0.82]) {
        const time=Math.min(duration-0.1,Math.max(0.1,duration*fraction));
        await new Promise((resolve,reject)=>{v.onseeked=resolve;v.onerror=reject;v.currentTime=time;});
        ctx.drawImage(v,0,0);frames.push({time,data:canvas.toDataURL('image/jpeg',0.94).split(',')[1]});
      }
      v.remove();return {width,height,duration,frames};
    },{id});
    const overlays=[];
    for(let j=0;j<result.frames.length;j++) {
      const frame=result.frames[j];const bytes=Buffer.from(frame.data,'base64');
      const frameFile=path.join(outDir,`${id}-frame-${j+1}.jpg`);await fs.writeFile(frameFile,bytes);
      const x=(j%3)*400,y=Math.floor(j/3)*258;
      overlays.push({input:await sharp(bytes).resize(400,225,{fit:'contain',background:'#111827'}).toBuffer(),left:x,top:y});
      overlays.push({input:Buffer.from(`<svg width="400" height="33"><rect width="400" height="33" fill="#111827"/><text x="12" y="23" font-size="17" font-family="Arial" fill="white">${id} / frame ${j+1} / ${frame.time.toFixed(2)}s</text></svg>`),left:x,top:y+225});
    }
    const contactSheet=path.join(outDir,`${id}-contact.jpg`);
    await sharp({create:{width:1200,height:516,channels:3,background:'#111827'}}).composite(overlays).jpeg({quality:90}).toFile(contactSheet);
    const m={id,original:filenames[i],width:result.width,height:result.height,duration:result.duration,frames:result.frames.map((f,j)=>({index:j+1,time:f.time,path:path.join(outDir,`${id}-frame-${j+1}.jpg`)})),contactSheet};
    metadata.push(m);console.log(JSON.stringify(m));
  }
  await fs.writeFile(path.join(outDir,'metadata.json'),JSON.stringify(metadata,null,2));
  await browser.close();server.close();
})().catch(err=>{console.error(err);process.exit(1);});
