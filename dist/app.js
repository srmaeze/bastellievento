(() => {
  'use strict';
  const content = window.BASTELLI_CONTENT;
  if (!content) return;
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const createLink = (url, className) => {
    const link = el('a', className);
    link.href = url;
    return link;
  };
  const eventsGrid = document.getElementById('events-grid');
  content.events.forEach(event => {
    const card = el('article','event-card');
    const cover = event.pageUrl ? createLink(event.pageUrl,'event-cover') : el('div','event-cover');
    if (event.pageUrl) cover.setAttribute('aria-label',`Ver evento: ${event.title}`);
    if (event.thumbnail) {
      const img = el('img');
      img.src = event.thumbnail;
      img.alt = `Capa do vídeo de ${event.title}`;
      img.loading = 'lazy';
      img.width = 640;
      img.height = 400;
      cover.append(img);
    } else {
      // Tratamento tipográfico neutro, sem apresentar fotos de outros encontros
      // como se fossem a miniatura de um vídeo ainda não identificado.
      const graphic = el('div','cover-unavailable');
      graphic.setAttribute('aria-hidden','true');
      const brand = el('span',null);
      brand.append(document.createTextNode('Encontros'),document.createElement('br'),document.createTextNode('Bastelli.'));
      graphic.append(brand,el('span',null,event.displayDate));
      cover.append(graphic);
    }
    cover.append(el('span','event-tag','Finalizado'));
    const meta = el('p','event-meta');
    const time = el('time',null,event.displayDate);
    time.dateTime = event.date;
    meta.append(time);
    const title = el('h3');
    if (event.pageUrl) {
      const link = createLink(event.pageUrl);
      link.textContent = event.title;
      title.append(link);
    } else title.textContent = event.title;
    card.append(cover,meta,title);
    card.append(el('p','event-extra',event.extra || '\u00a0'));
    if (event.pageUrl) {
      const link = createLink(event.pageUrl,'event-link');
      link.append(document.createTextNode('Ver evento'),el('span',null,'↗'));
      link.lastChild.setAttribute('aria-hidden','true');
      link.setAttribute('aria-label',`Ver evento: ${event.title}`);
      card.append(link);
    }
    eventsGrid.append(card);
  });

  const testimonialsGrid = document.getElementById('testimonials-grid');
  content.testimonials.forEach((video,index) => {
    const figure = el('figure','testimonial-card');
    const stage = el('div','video-stage');
    const button = el('button','video-poster');
    button.type = 'button';
    button.setAttribute('aria-label',`Carregar vídeo ${index+1}: ${video.label}`);
    const image = el('img');
    image.src = video.thumbnail;
    image.width = 360;
    image.height = 640;
    image.alt = '';
    image.loading = 'lazy';
    const play = el('span','video-play');
    play.setAttribute('aria-hidden','true');
    play.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5 20 12 7 19.5z"/></svg>';
    const number = el('span','video-number',String(index+1).padStart(2,'0')+' / 05');
    number.setAttribute('aria-hidden','true');
    button.append(image,play,number);
    button.addEventListener('click',() => {
      const frame = el('iframe');
      frame.src = `https://player.vimeo.com/video/${video.id}?autoplay=0&controls=1&playsinline=1&dnt=1`;
      frame.title = `Vídeo ${index+1}: ${video.label}`;
      frame.allow = 'fullscreen; picture-in-picture; encrypted-media';
      frame.allowFullscreen = true;
      stage.replaceChildren(frame);
      frame.focus();
    },{once:true});
    stage.append(button);
    const caption = el('figcaption','testimonial-caption');
    const link = createLink(`https://vimeo.com/${video.id}`);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = video.label;
    link.setAttribute('aria-label',`${video.label}: abrir vídeo ${index+1} no Vimeo, nova aba`);
    const arrow = el('span',null,'↗');
    arrow.setAttribute('aria-hidden','true');
    caption.append(link,arrow);
    figure.append(stage,caption);
    testimonialsGrid.append(figure);
  });

  // Links para o cadastro mantêm um destino único e transferem o foco para
  // o contêiner, permitindo continuar pelo teclado até o formulário externo.
  document.querySelectorAll('a[href="#lista-espera"]').forEach(link => {
    link.addEventListener('click',() => {
      document.getElementById('lista-espera').focus({preventScroll:true});
    });
  });
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.06});
    document.querySelectorAll('.section-intro,.event-card,.testimonial-heading,.about-grid,.final-grid').forEach(node => {
      node.classList.add('reveal-ready');
      observer.observe(node);
    });
  }
})();
