import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildQueue, shuffle, MODES } from '../src/lib/modes.js';
import { DECKS, findDeck } from '../src/lib/decks.js';

const now = new Date(2026, 10, 10, 12).getTime();
const DAY = 86400000;
const js = findDeck('jsbasics');

test('flashcards: due cards in the deck, then new ones up to the limit', () => {
  assert.equal(buildQueue('flashcards', { deck: js, decks: DECKS, states: {}, newLimit: 5, now }).length, 5);
});

test('quick review is 10 cards and tops up with the next cards due', () => {
  const states = Object.fromEntries(js.cards.map((c, i) => [c.id, { reps: 2, lapses: 0, interval: 3, ease: 2.5, due: now + (i + 1) * DAY }]));
  states[js.cards[4].id].due = now - 1000;            // only one card is due
  const q = buildQueue('quick', { deck: js, decks: DECKS, states, now });
  assert.equal(q.length, 10);
  assert.equal(q[0].id, js.cards[4].id);
  assert.equal(q[1].id, js.cards[0].id);              // then the one coming back soonest
});

test('practice test mixes decks and stops at 20 cards', () => {
  const q = buildQueue('mixed', { deck: js, decks: DECKS, states: {}, now, seed: 7 });
  assert.equal(q.length, 20);
  const decksUsed = new Set(q.map(c => c.id.split('-')[0]));
  assert.ok(decksUsed.size > 2);
});

test('challenge uses every card in the deck, shuffled', () => {
  const q = buildQueue('challenge', { deck: js, decks: DECKS, states: {}, now, seed: 3 });
  assert.deepEqual(q.map(c => c.id).sort(), js.cards.map(c => c.id).sort());
});

test('shuffle with a seed is repeatable', () => {
  assert.deepEqual(shuffle([1, 2, 3, 4, 5], 9), shuffle([1, 2, 3, 4, 5], 9));
  assert.equal(MODES.length, 4);
});
