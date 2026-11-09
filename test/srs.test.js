import { test } from 'node:test';
import assert from 'node:assert/strict';
import { review, newCardState, dueQueue, isDue, dueLabel, MIN_EASE } from '../src/lib/srs.js';

const DAY = 86400000;
const t0 = Date.UTC(2026, 10, 9, 13, 0);

test('a new card rated good comes back tomorrow, then in 6 days, then grows by its ease', () => {
  let s = review(newCardState(), 'good', t0);
  assert.equal(s.interval, 1);
  assert.equal(s.due, t0 + DAY);
  s = review(s, 'good', s.due);
  assert.equal(s.interval, 6);
  s = review(s, 'good', s.due);
  assert.equal(s.interval, 15); // 6 * 2.5
});

test('easy jumps further and raises the ease; hard grows slowly and lowers it', () => {
  const easy = review(newCardState(), 'easy', t0);
  assert.equal(easy.interval, 4);
  assert.equal(easy.ease, 2.65);
  const hard = review(review(review(newCardState(), 'good', t0), 'good', t0), 'hard', t0);
  assert.equal(hard.interval, 7); // 6 * 1.2
  assert.equal(hard.ease, 2.35);
});

test('again resets the streak, counts a lapse and brings the card back in 10 minutes', () => {
  const s = review(review(newCardState(), 'good', t0), 'again', t0);
  assert.equal(s.reps, 0);
  assert.equal(s.lapses, 1);
  assert.equal(s.due, t0 + 10 * 60 * 1000);
  assert.equal(s.ease, 2.3);
});

test('ease never drops below the minimum', () => {
  let s = newCardState();
  for (let i = 0; i < 20; i++) s = review(s, 'again', t0);
  assert.equal(s.ease, MIN_EASE);
});

test('an unknown grade is refused', () => {
  assert.throws(() => review(newCardState(), 'perfect', t0));
});

test('dueQueue lists due cards (most overdue first) and then new ones, up to the limit', () => {
  const cards = ['a', 'b', 'c', 'd', 'e'].map(id => ({ id }));
  const states = {
    a: { reps: 1, lapses: 0, due: t0 - DAY },
    b: { reps: 2, lapses: 0, due: t0 + DAY },
    c: { reps: 1, lapses: 0, due: t0 - 2 * DAY },
  };
  assert.deepEqual(dueQueue(cards, states, t0, 1).map(c => c.id), ['c', 'a', 'd']);
});

test('isDue and dueLabel', () => {
  assert.equal(isDue(undefined, t0), true);
  assert.equal(isDue({ due: t0 + 1 }, t0), false);
  assert.equal(dueLabel({ due: t0 + 30 * 60000 }, t0), 'in 30 min');
  assert.equal(dueLabel({ due: t0 + DAY }, t0), 'tomorrow');
  assert.equal(dueLabel({ due: t0 + 6 * DAY }, t0), 'in 6 days');
  assert.equal(dueLabel({ due: t0 - 1 }, t0), 'due now');
});
