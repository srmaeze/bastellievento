import {readFileSync,existsSync,readdirSync} from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=path.resolve('dist');
const html=readFileSync('dist/index.html','utf8');
const exact='<iframe src="https://bc-contentadmin.lovable.app/lista-espera" width="100%" height="640" style="border:0;max-width:520px;" title="Lista de espera" loading="lazy"></iframe>';
assert(html.includes(exact),'O iframe deve preservar todos os atributos fornecidos.');
assert.equal((html.match(/<iframe\b/g)||[]).length,1);
assert(!/<form\b/.test(html),'Não deve haver formulário independente.');
const sections=['class="hero"','id="encontros"','class="testimonials"','id="sobre"','class="final-cta"'];
let last=-1;for(const marker of sections){const current=html.indexOf(marker);assert(current>last,marker);last=current;}
const context={window:{}};vm.runInNewContext(readFileSync('dist/content.js','utf8'),context);
const {events,testimonials}=context.window.BASTELLI_CONTENT;
assert.equal(events.length,7);assert.equal(testimonials.length,11);
assert.equal(events[0].date,'2026-10-22');
for(let i=1;i<events.length;i++)assert(events[i-1].date>events[i].date,'Ordem cronológica dos encontros.');
for(const event of events)for(const key of ['thumbnail','videoUrl','pageUrl'])if(event[key]?.startsWith('./'))assert(existsSync(path.join(root,event[key])),event[key]);
for(const video of testimonials){assert(existsSync(path.join(root,video.thumbnail)),video.thumbnail);if(video.videoUrl)assert(existsSync(path.join(root,video.videoUrl)),video.videoUrl);}
const files=['dist/index.html',...readdirSync('dist/eventos').map(name=>'dist/eventos/'+name)];
for(const file of files){const source=readFileSync(file,'utf8');for(const match of source.matchAll(/(?:href|src|poster)="([^"#]+)(?:#[^"]*)?"/g)){const url=match[1];if(url.startsWith('http'))continue;const pathname=url.split(/[?#]/)[0];assert(existsSync(path.resolve(path.dirname(file),pathname)),`${file} → ${url}`);}assert.equal((source.match(/src="(?:\.\/|\.\.\/)meta-pixel\.js"/g)||[]).length,1,`${file}: one Pixel script`);assert.equal((source.match(/facebook\.com\/tr\?id=1126433449891278&amp;ev=PageView&amp;noscript=1/g)||[]).length,1,`${file}: PageView noscript`);if(file.includes('/eventos/')){assert(source.includes(' controls playsinline preload="metadata"'));assert(!source.includes('autoplay'));}}
console.log(JSON.stringify({result:'ok',htmlPages:files.length,events:events.length,testimonials:testimonials.length,form:'iframe original preservado',pending:events.filter(e=>!e.thumbnail||!e.pageUrl).map(e=>({title:e.title,cover:!e.thumbnail,url:!e.pageUrl}))},null,2));

