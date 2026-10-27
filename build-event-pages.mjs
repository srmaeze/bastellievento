import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import vm from 'node:vm';
const context={window:{}};
vm.runInNewContext(readFileSync('dist/content.js','utf8'),context);
mkdirSync('dist/eventos',{recursive:true});
for (const event of context.window.BASTELLI_CONTENT.events.filter(e=>e.videoUrl&&e.pageUrl?.startsWith('./eventos/'))) {
  const title=event.title;
  const humanDate=new Date(event.date+'T12:00:00Z').toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
  const html=`<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#131f2f"><title>${title} | Encontros Bastelli</title><meta name="description" content="Registro do encontro ${title}, realizado em ${humanDate}, com a Bastelli."><link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="../refinements.css"></head>
<body><a class="skip-link" href="#conteudo">Pular para o conteúdo</a><header class="site-header"><nav class="container nav" aria-label="Navegação principal"><a href="../index.html" class="brand" aria-label="Bastelli, início"><img src="../assets/bastelli-logo.png" width="3417" height="392" alt="Bastelli"></a><a class="detail-back" href="../index.html#encontros">← Todos os encontros</a></nav></header>
<main id="conteudo" class="detail-main"><div class="container detail-container"><p class="eyebrow"><span class="small-line" aria-hidden="true"></span> ENCONTROS BASTELLI · FINALIZADO</p><h1>${title}</h1><p class="detail-meta"><time datetime="${event.date}">${humanDate}</time>${event.extra?`<span aria-hidden="true"> / </span>${event.extra}`:''}</p><p class="detail-description">Assista ao registro do encontro.</p><video class="event-video" controls playsinline preload="metadata" poster=".${event.thumbnail}"><source src=".${event.videoUrl}" type="video/mp4">Seu navegador não suporta este vídeo. <a href=".${event.videoUrl}">Abrir o vídeo do encontro</a>.</video><div class="detail-next"><div><p class="eyebrow">NOSSO PRÓXIMO ENCONTRO</p><h2>O Lucro Invisível</h2><p>5 de novembro de 2026 · Evento gratuito</p></div><a class="button" href="../index.html#lista-espera">QUERO ENTRAR NA LISTA DE ESPERA <span aria-hidden="true">↗</span></a></div></div></main><footer class="footer"><div class="container footer-inner"><a class="brand" href="../index.html" aria-label="Bastelli, início"><img src="../assets/bastelli-logo.png" width="3417" height="392" alt="Bastelli"></a><span>Consultoria especializada em e-commerce.</span><span>© 2026 Bastelli.</span></div></footer></body></html>`;
  writeFileSync('dist/'+event.pageUrl.slice(2),html);
}
console.log('Páginas dos encontros geradas com os vídeos reais.');

