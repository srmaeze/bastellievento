import assert from 'node:assert/strict';
import {getCountdownState} from './dist/countdown.mjs';

const at = timestamp => getCountdownState(Date.parse(timestamp));

assert.equal(at('2026-11-09T14:00:00-03:00').days,9);
assert.equal(at('2026-11-16T23:59:59-03:00').calendarDay,'future');
assert.equal(at('2026-11-17T00:00:00-03:00').calendarDay,'tomorrow');
assert.equal(at('2026-11-17T14:00:00-03:00').totalSeconds,86400);

const midnight = at('2026-11-18T00:00:00-03:00');
assert.equal(midnight.phase,'counting');
assert.equal(midnight.calendarDay,'today');
assert.equal(midnight.hours,14);
const lastSecond = at('2026-11-18T13:59:59-03:00');
assert.equal(lastSecond.totalSeconds,1);
assert.equal(lastSecond.seconds,1);

assert.equal(at('2026-11-18T14:00:00-03:00').phase,'today');
assert.equal(at('2026-11-18T23:59:59-03:00').phase,'today');
assert.equal(at('2026-11-19T00:00:00-03:00').phase,'ended');

console.log('Countdown OK: 18/11/2026 às 14h em Limeira; calendário e fronteiras verificados.');
