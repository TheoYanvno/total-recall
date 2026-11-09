// Study modes: each one builds the list of cards for a session.
import { dueQueue, isDue } from './srs.js';

export const MODES = [
  { id: 'flashcards', label: 'Flashcards', sub: 'Classic', about: 'Every card that is due in this deck, then new ones.' },
  { id: 'quick', label: 'Quick Review', sub: '10 cards', about: 'Ten cards from this deck: due ones first.' },
  { id: 'mixed', label: 'Practice Test', sub: 'Mixed', about: 'Up to 20 cards from every deck, shuffled.' },
  { id: 'challenge', label: 'Challenge', sub: 'Timed', about: 'As many cards from this deck as you can in 2 minutes.' },
];

export const CHALLENGE_SECONDS = 120;

// A repeatable shuffle (seeded), so tests can check the result.
export function shuffle(list, seed = Date.now()) {
  const out = [...list];
  let s = seed >>> 0 || 1;
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// mode: one of MODES; deck: the chosen deck; decks: all decks; newLimit: new cards allowed per session.
export function buildQueue(mode, { deck, decks, states, newLimit = 10, now = Date.now(), seed = now }) {
  if (mode === 'quick') {
    const queue = dueQueue(deck.cards, states, now, newLimit);
    if (queue.length >= 10) return queue.slice(0, 10);
    // Not enough due: top up with the cards coming back soonest, so a quick review is never empty.
    const extra = deck.cards
      .filter(c => !queue.includes(c) && states[c.id] && !isDue(states[c.id], now))
      .sort((a, b) => states[a.id].due - states[b.id].due);
    return [...queue, ...extra].slice(0, 10);
  }
  if (mode === 'mixed') {
    const all = decks.flatMap(d => dueQueue(d.cards, states, now, Math.ceil(newLimit / 2)));
    return shuffle(all, seed).slice(0, 20);
  }
  if (mode === 'challenge') return shuffle(deck.cards, seed);
  return dueQueue(deck.cards, states, now, newLimit);
}
