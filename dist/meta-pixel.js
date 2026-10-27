(() => {
  'use strict';
  // One initialization and one PageView per document, even if loaded twice.
  if (window.__bastelliMetaPixelLoaded) return;
  window.__bastelliMetaPixelLoaded = true;

  !function(f,b,e,v,n,t,s) {
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s);
  }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init','1126433449891278');
  window.fbq('track','PageView');

  // The external Lovable form does not currently emit this confirmation.
  // See docs/meta-pixel-formulario.md for its required success-only change.
  // Never infer success from clicks, iframe loads, redirects or submit attempts.
  const formOrigin = 'https://bc-contentadmin.lovable.app';
  const processed = new Set();
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  window.addEventListener('message',event => {
    if (event.origin !== formOrigin) return;
    const frame = document.querySelector('#lista-espera iframe');
    if (!frame || event.source !== frame.contentWindow) return;
    const data = event.data;
    if (!data || typeof data !== 'object' || data.type !== 'bastelli:waitlist:success' || data.version !== 1) return;
    if (typeof data.submissionId !== 'string' || !uuid.test(data.submissionId)) return;
    const id = data.submissionId.toLowerCase();
    const storageKey = 'bastelli:meta:lead:'+id;
    if (processed.has(id)) return;
    try { if (window.sessionStorage.getItem(storageKey) === '1') return; } catch {}
    processed.add(id);
    try { window.sessionStorage.setItem(storageKey,'1'); } catch {}
    window.fbq('track','Lead',{}, {eventID:'bastelli-waitlist-'+id});
  });
})();
