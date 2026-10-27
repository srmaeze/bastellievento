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
  const eventDialog = document.getElementById('event-dialog');
  const eventDialogVideo = document.getElementById('event-dialog-video');
  let eventDialogTrigger = null;
  if (eventDialog && eventDialogVideo) {
    eventDialog.querySelector('.event-dialog-close').addEventListener('click',() => eventDialog.close());
    eventDialog.addEventListener('click',event => {
      if (event.target !== eventDialog) return;
      const bounds = eventDialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) eventDialog.close();
    });
    eventDialog.addEventListener('close',() => {
      eventDialogVideo.pause();
      eventDialogVideo.removeAttribute('src');
      eventDialogVideo.removeAttribute('poster');
      eventDialogVideo.load();
      const trigger = eventDialogTrigger;
      eventDialogTrigger = null;
      if (trigger?.isConnected) trigger.focus({preventScroll:true});
    });
  }
  const configureEventLink = (link,event) => {
    if (!event.videoUrl || !eventDialog || !eventDialogVideo || typeof eventDialog.showModal !== 'function') return link;
    link.setAttribute('aria-haspopup','dialog');
    link.setAttribute('aria-controls','event-dialog');
    link.dataset.eventVideo = event.date;
    link.addEventListener('click',click => {
      // Preserve navigation for modified clicks and the real event-page fallback.
      if (click.button !== 0 || click.metaKey || click.ctrlKey || click.shiftKey || click.altKey) return;
      click.preventDefault();
      document.getElementById('event-dialog-title').textContent = event.title;
      document.getElementById('event-dialog-meta').textContent = [event.displayDate,event.extra].filter(Boolean).join(' · ');
      eventDialogVideo.poster = event.thumbnail || '';
      eventDialogVideo.src = event.videoUrl;
      eventDialogVideo.load();
      eventDialogTrigger = link;
      if (!eventDialog.open) eventDialog.showModal();
    });
    return link;
  };
  const eventsGrid = document.getElementById('events-grid');
  content.events.forEach(event => {
    const card = el('article','event-card event-banner');
    const date = el('div','banner-date');
    const time = el('time');
    time.dateTime = event.date;
    const [day,month,year] = event.displayDate.split(' ');
    time.append(el('span','banner-day',day),el('span','banner-month',month),el('span','banner-year',year));
    date.append(time);
    const details = el('div','banner-content');
    details.append(el('span','event-tag','Finalizado'));
    const cover = event.pageUrl ? configureEventLink(createLink(event.pageUrl,'event-cover'),event) : el('div','event-cover');
    if (event.pageUrl) cover.setAttribute('aria-label',`Veja como foi: ${event.title}`);
    if (event.thumbnail) {
      const img = el('img');
      img.src = event.thumbnail;
      img.alt = event.thumbnailAlt || (event.videoUrl ? `Capa do vídeo de ${event.title}` : `Imagem de ${event.title}`);
      img.loading = 'lazy';
      img.width = 640;
      img.height = 400;
      cover.append(img);
    } else {
      // Tratamento tipográfico neutro, sem apresentar fotos de outros encontros
      // como se fossem a miniatura de um vídeo ainda não identificado.
      const graphic = el('div','banner-art');
      graphic.setAttribute('aria-hidden','true');
      cover.append(graphic);
    }
    const title = el('h3');
    if (event.pageUrl) {
      const link = configureEventLink(createLink(event.pageUrl),event);
      link.textContent = event.title;
      title.append(link);
    } else title.textContent = event.title;
    details.append(title);
    if (event.extra) details.append(el('p','event-extra',event.extra));
    if (event.thumbnailCaption) details.append(el('span','event-image-credit',event.thumbnailCaption));
    if (event.pageUrl) {
      const link = configureEventLink(createLink(event.pageUrl,'event-link'),event);
      link.append(document.createTextNode('Veja como foi'),el('span',null,'↗'));
      link.lastChild.setAttribute('aria-hidden','true');
      link.setAttribute('aria-label',`Veja como foi: ${event.title}`);
      details.append(link);
    }
    card.append(date,details,cover);
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
