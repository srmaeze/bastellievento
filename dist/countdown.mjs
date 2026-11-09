// Confirmed start time in Limeira (America/Sao_Paulo, UTC-03).
// No end time was supplied: keep the event-day message until local midnight.
const PREVIOUS_DAY = Date.parse('2026-11-17T00:00:00-03:00');
const EVENT_DAY = Date.parse('2026-11-18T00:00:00-03:00');
const EVENT_DATE = Date.parse('2026-11-18T14:00:00-03:00');
const NEXT_DAY = Date.parse('2026-11-19T00:00:00-03:00');

export function getCountdownState(now = Date.now()) {
  if (now >= NEXT_DAY) return {phase:'ended'};
  if (now >= EVENT_DATE) return {phase:'today'};
  const totalSeconds = Math.max(0,Math.ceil((EVENT_DATE-now)/1000));
  return {
    phase:'counting',totalSeconds,
    calendarDay:now >= EVENT_DAY ? 'today' : now >= PREVIOUS_DAY ? 'tomorrow' : 'future',
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
  clock.setAttribute('aria-label','Tempo restante até 18 de novembro de 2026, às 14h, horário de Brasília');
  let interval;
  let firstRender = true;

  function render() {
    const state = getCountdownState();
    root.dataset.phase = state.phase;
    clock.hidden = state.phase !== 'counting';
    if (state.phase === 'counting') {
      const nextHeadline = state.calendarDay === 'today' ? 'É hoje, às 14h. Falta pouco!' : state.calendarDay === 'tomorrow' ? 'É amanhã, às 14h!' : state.totalSeconds <= 14*86400 ? 'Faltam poucos dias.' : 'A contagem já começou.';
      if (headline.textContent !== nextHeadline) headline.textContent = nextHeadline;
      caption.textContent = '18 de novembro de 2026 · às 14h · horário de Brasília.';
      for (const node of units) {
        const next = String(state[node.dataset.countdownUnit]).padStart(2,'0');
        if (node.textContent === next) continue;
        node.textContent = next;
        if (!firstRender && !reducedMotion.matches && typeof node.animate === 'function') {
          node.animate([{opacity:.5,transform:'translateY(-4px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'ease-out'});
        }
      }
      const nextSummary = `Faltam ${state.days} ${state.days === 1 ? 'dia' : 'dias'}, ${state.hours} ${state.hours === 1 ? 'hora' : 'horas'}, ${state.minutes} ${state.minutes === 1 ? 'minuto' : 'minutos'} e ${state.seconds} ${state.seconds === 1 ? 'segundo' : 'segundos'} até 18 de novembro de 2026, às 14h, horário de Brasília.`;
      if (summary.textContent !== nextSummary) summary.textContent = nextSummary;
    } else {
      const today = state.phase === 'today';
      headline.textContent = today ? 'O encontro é hoje!' : 'Este encontro já aconteceu.';
      caption.textContent = today ? '18 de novembro de 2026 · início às 14h · Escritório da Bastelli.' : 'Acompanhe os próximos encontros da Bastelli.';
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
