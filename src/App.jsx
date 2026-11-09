import { useState } from 'react';
import { DECKS, findDeck } from './lib/decks.js';

export default function App() {
  const [openId, setOpenId] = useState(null);
  const deck = openId ? findDeck(openId) : null;

  return (
    <>
      <header>
        <h1>🧠 TotalRecall</h1>
        <span className="muted">Flashcards for programming terms</span>
      </header>
      <main>
        {deck ? <DeckView deck={deck} onBack={() => setOpenId(null)} /> : <DeckList onOpen={setOpenId} />}
      </main>
    </>
  );
}

function DeckList({ onOpen }) {
  return (
    <section aria-labelledby="decks-title">
      <h2 id="decks-title">Decks</h2>
      <p className="muted">Each deck follows a CodeForge lesson. Pick one to see its cards.</p>
      <div className="grid">
        {DECKS.map(deck => (
          <button key={deck.id} className="deck" onClick={() => onOpen(deck.id)}>
            <h2>{deck.title}</h2>
            <span className="muted">{deck.blurb}</span>
            <span className="badge">{deck.cards.length} cards</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function DeckView({ deck, onBack }) {
  return (
    <section aria-labelledby="deck-title">
      <button onClick={onBack}>← All decks</button>
      <h2 id="deck-title">{deck.title}</h2>
      <p className="muted">{deck.blurb}</p>
      <ul className="cardlist">
        {deck.cards.map(card => (
          <li key={card.id}>
            <strong>{card.term}</strong> — {card.back}
            {card.example && <pre><code>{card.example}</code></pre>}
          </li>
        ))}
      </ul>
    </section>
  );
}
