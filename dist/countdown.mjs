// The start time is not confirmed. Count to the calendar date in Limeira,
// rather than implying a time for the event itself.
const EVENT_DATE = Date.parse('2026-11-05T00:00:00-03:00');
const EVENT_END = Date.parse('2026-11-06T00:00:00-03:00');

export function getCountdownState(now = Date.now()) {
  if (now >= EVENT_END) return {phase:'ended'};
  if (now >= EVENT_DATE) return {phase:'today'};
  const totalSeconds = Math.max(0,Math.ceil((EVENT_DATE-now)/1000));
  return {
    phase:'counting',totalSeconds,
    days:Math.floor(totalSeconds/86400),
    hours:Math.floor(totalSeconds/3600)%24,
    minutes:Math.floor(totalSeconds/60)%60,
    seconds:totalSeconds%60
  };
}

function mountCountdown(root) {
  const clock = root.querySelector('.countdown-clock');
  const headline = root.querySelector('#countdown-headline');
  const caption = root.querySelector('#countdown-caption');
  const summary = root.querySelector('[data-countdown-summary]');
  const units = [...root.querySelectorAll('[data-countdown-unit]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let interval;
  let firstRender = true;

  function render() {
    const state = getCountdownState();
    root.dataset.phase = state.phase;
    clock.hidden = state.phase !== 'counting';
    if (state.phase === 'counting') {
      const nextHeadline = state.totalSeconds <= 86400 ? 'É amanhã. Falta pouco!' : state.totalSeconds <= 14*86400 ? 'Faltam poucos dias.' : 'A contagem já começou.';
      if (headline.textContent !== nextHeadline) headline.textContent = nextHeadline;
      for (const node of units) {
        const next = String(state[node.dataset.countdownUnit]).padStart(2,'0');
        if (node.textContent === next) continue;
        node.textContent = next;
        if (!firstRender && !reducedMotion.matches && typeof node.animate === 'function') {
          node.animate([{opacity:.5,transform:'translateY(-4px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'ease-out'});
        }
      }
      const nextSummary = `Faltam ${state.days} ${state.days === 1 ? 'dia' : 'dias'}, ${state.hours} ${state.hours === 1 ? 'hora' : 'horas'} e ${state.minutes} ${state.minutes === 1 ? 'minuto' : 'minutos'} até 5 de novembro.`;
      if (summary.textContent !== nextSummary) summary.textContent = nextSummary;
    } else {
      const today = state.phase === 'today';
      headline.textContent = today ? 'É hoje. O encontro chegou!' : 'Este encontro já aconteceu.';
      caption.textContent = today ? 'O Lucro Invisível, 5 de novembro de 2026.' : 'Acompanhe os próximos encontros da Bastelli.';
      if (!today) clearInterval(interval);
    }
    firstRender = false;
  }

  function sync() {
    clearInterval(interval);
    render();
    if (!document.hidden && root.dataset.phase !== 'ended') interval = setInterval(render,1000);
  }
  document.addEventListener('visibilitychange',sync);
  sync();
}

if (typeof document !== 'undefined') {
  const countdown = document.getElementById('event-countdown');
  if (countdown) mountCountdown(countdown);
}
