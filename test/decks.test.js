import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DECKS, allCards, findDeck } from '../src/lib/decks.js';

test('every deck has an id, a title, a lesson and at least five cards', () => {
  for (const deck of DECKS) {
    assert.ok(deck.id && deck.title && deck.lesson, deck.id);
    assert.ok(deck.cards.length >= 5, `${deck.id} has ${deck.cards.length} cards`);
  }
});

test('card ids are unique across all decks', () => {
  const ids = allCards().map(card => card.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('every card has a term and an answer', () => {
  for (const card of allCards()) {
    assert.ok(card.term.trim(), card.id);
    assert.ok(card.back.trim().length > 10, card.id);
  }
});

test('allCards tags each card with its deck', () => {
  const first = allCards()[0];
  assert.equal(first.deckId, DECKS[0].id);
});

test('findDeck returns the deck or null', () => {
  assert.equal(findDeck('htmlcss').title, 'HTML and CSS');
  assert.equal(findDeck('nope'), null);
});
