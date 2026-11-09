// Sharing decks as JSON files: export any deck, and import a deck someone else made. Imported files are
// checked field by field, trimmed to sensible sizes, and given ids that can't clash with built-in cards.

export const LIMITS = { title: 80, blurb: 200, term: 120, back: 1000, example: 2000, cards: 500 };

export function exportDeck(deck) {
  const { id, title, blurb, cards } = deck;
  return JSON.stringify({ format: 'total-recall-deck', version: 1, deck: { id, title, blurb, cards: cards.map(({ id, term, back, example }) => ({ id, term, back, ...(example ? { example } : {}) })) } }, null, 2);
}

function text(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

// Returns { deck } or { error } with a message a person can act on.
export function importDeck(json, existingIds = new Set()) {
  let data;
  try {
    data = JSON.parse(json);
  } catch {
    return { error: 'That file isn\'t valid JSON.' };
  }
  const raw = data && data.format === 'total-recall-deck' ? data.deck : data;
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.cards)) return { error: 'No deck found: the file needs a "cards" list.' };
  const title = text(raw.title, LIMITS.title) || 'Imported deck';
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'deck';
  let id = `custom-${slug}`;
  for (let n = 2; existingIds.has(id); n++) id = `custom-${slug}-${n}`;

  const cards = [];
  for (const [i, c] of raw.cards.slice(0, LIMITS.cards).entries()) {
    const term = text(c && c.term, LIMITS.term);
    const back = text(c && c.back, LIMITS.back);
    if (!term || !back) continue;
    const example = text(c.example, LIMITS.example);
    cards.push({ id: `${id}-${i + 1}`, term, back, ...(example ? { example } : {}) });
  }
  if (cards.length === 0) return { error: 'The deck has no cards with both a term and an answer.' };
  return { deck: { id, title, blurb: text(raw.blurb, LIMITS.blurb) || `${cards.length} imported cards`, lesson: null, custom: true, cards } };
}
