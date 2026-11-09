// A small colored badge for each deck, so decks are easy to tell apart at a glance.
const ICONS = {
  setup: { label: '>_', bg: '#1f2937', fg: '#e5e7eb' },
  htmlcss: { label: '</>', bg: '#ea580c', fg: '#fff7ed' },
  jsbasics: { label: 'JS', bg: '#facc15', fg: '#1c1917' },
  reactbasics: { label: 'JSX', bg: '#0e7490', fg: '#ecfeff' },
  python: { label: 'Py', bg: '#2563eb', fg: '#fde047' },
  sql: { label: 'SQL', bg: '#7c3aed', fg: '#f5f3ff' },
  web: { label: 'API', bg: '#059669', fg: '#ecfdf5' },
};

export function deckIcon(deck) {
  if (ICONS[deck.id]) return ICONS[deck.id];
  const word = (deck.title || '?').replace(/[^A-Za-z0-9]/g, '');
  return { label: word.slice(0, 2) || '?', bg: '#4338ca', fg: '#eef2ff' };
}

export default function DeckIcon({ deck, size = 36 }) {
  const { label, bg, fg } = deckIcon(deck);
  return (
    <span className="deck-icon" aria-hidden="true"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * (label.length > 2 ? 0.3 : 0.4) }}>
      {label}
    </span>
  );
}
