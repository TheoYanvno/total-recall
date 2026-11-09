import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load, save, recordReview, streak, stats, dayKey, emptyProgress } from '../src/lib/progress.js';

function memory(initial) {
  const m = new Map(initial ? [['total-recall:v1', initial]] : []);
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
}

const noon = new Date(2026, 10, 9, 12).getTime();
const DAY = 86400000;

test('progress saves and loads back the same', () => {
  const store = memory();
  let p = recordReview(emptyProgress(), 'js-map', { reps: 1, interval: 1, ease: 2.5, due: noon + DAY, lapses: 0 }, noon);
  assert.equal(save(p, store), true);
  assert.deepEqual(load(store), p);
});

test('broken or tampered saved data starts fresh instead of crashing', () => {
  assert.deepEqual(load(memory('{not json')), emptyProgress());
  assert.deepEqual(load(memory('42')), emptyProgress());
  const mixed = JSON.stringify({ states: { ok: { due: 1, interval: 1, ease: 2.5 }, bad: { due: 'soon' } }, days: { '2026-11-09': 3, nope: 2, '2026-11-08': -1 } });
  const p = load(memory(mixed));
  assert.deepEqual(Object.keys(p.states), ['ok']);
  assert.deepEqual(p.days, { '2026-11-09': 3 });
});

test('saving fails quietly when storage refuses', () => {
  assert.equal(save(emptyProgress(), { setItem() { throw new Error('full'); } }), false);
});

test('streak counts days in a row, starting today or yesterday', () => {
  const days = { [dayKey(noon)]: 4, [dayKey(noon - DAY)]: 2, [dayKey(noon - 2 * DAY)]: 1, [dayKey(noon - 4 * DAY)]: 9 };
  assert.equal(streak(days, noon), 3);
  assert.equal(streak(days, noon + DAY), 3);   // haven't studied yet today: still 3
  assert.equal(streak(days, noon + 2 * DAY), 0);
});

test('stats sort cards into new, learning and mature', () => {
  const cards = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const states = { b: { reps: 2, lapses: 0, interval: 6 }, c: { reps: 5, lapses: 0, interval: 40 } };
  const s = stats(cards, states, { [dayKey(noon)]: 7 }, noon);
  assert.deepEqual(s, { fresh: 1, learning: 1, mature: 1, streak: 1, today: 7 });
});
