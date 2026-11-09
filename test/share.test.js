import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exportDeck, importDeck, LIMITS } from '../src/lib/share.js';
import { findDeck } from '../src/lib/decks.js';

test('an exported deck imports back with the same cards', () => {
  const sql = findDeck('sql');
  const { deck } = importDeck(exportDeck(sql));
  assert.equal(deck.title, 'SQL');
  assert.equal(deck.cards.length, sql.cards.length);
  assert.equal(deck.cards[0].term, sql.cards[0].term);
  assert.ok(deck.custom && deck.id.startsWith('custom-'));
});

test('a plain {title, cards} file works too, and bad cards are skipped', () => {
  const { deck } = importDeck(JSON.stringify({ title: 'Git', cards: [{ term: 'rebase', back: 'Replay commits on a new base.' }, { term: 'no answer' }, null] }));
  assert.equal(deck.cards.length, 1);
  assert.equal(deck.cards[0].id, 'custom-git-1');
});

test('ids never clash with existing decks', () => {
  const { deck } = importDeck(JSON.stringify({ title: 'Git', cards: [{ term: 'a', back: 'bbbbbbbb' }] }), new Set(['custom-git', 'custom-git-2']));
  assert.equal(deck.id, 'custom-git-3');
});

test('long text is trimmed and the card count is capped', () => {
  const cards = Array.from({ length: LIMITS.cards + 20 }, (_, i) => ({ term: 'x'.repeat(500), back: `answer ${i}` }));
  const { deck } = importDeck(JSON.stringify({ title: 'Big', cards }));
  assert.equal(deck.cards.length, LIMITS.cards);
  assert.equal(deck.cards[0].term.length, LIMITS.term);
});

test('clear errors for files that aren\'t decks', () => {
  assert.match(importDeck('nope').error, /valid JSON/);
  assert.match(importDeck('{"title":"x"}').error, /cards/);
  assert.match(importDeck('{"cards":[{"term":"a"}]}').error, /no cards/);
});
