import { useState } from 'react';
import { DECKS, findDeck } from './lib/decks.js';
import { review, dueQueue, dueLabel } from './lib/srs.js';
import Study from './components/Study.jsx';

export default function App() {
  const [openId, setOpenId] = useState(null);
  const [studyQueue, setStudyQueue] = useState(null);
  const [states, setStates] = useState({});
  const deck = openId ? findDeck(openId) : null;

  function startStudy(d) {
    setStudyQueue(dueQueue(d.cards, states));
  }

  function rate(card, grade) {
    setStates(prev => ({ ...prev, [card.id]: review(prev[card.id], grade) }));
  }

  let content;
  if (studyQueue) content = <Study queue={studyQueue} states={states} onRate={rate} onExit={() => setStudyQueue(null)} />;
  else if (deck) content = <DeckView deck={deck} states={states} onStudy={() => startStudy(deck)} onBack={() => setOpenId(null)} />;
  else content = <DeckList states={states} onOpen={setOpenId} />;

  return (
    <>
      <header>
        <h1>🧠 TotalRecall</h1>
        <span className="muted">Flashcards for programming terms</span>
      </header>
      <main>{content}</main>
    </>
  );
}

function countDue(deck, states) {
  return dueQueue(deck.cards, states, Date.now(), Infinity).length;
}

function DeckList({ states, onOpen }) {
  return (
    <section aria-labelledby="decks-title">
      <h2 id="decks-title">Decks</h2>
      <p className="muted">Each deck follows a CodeForge lesson. Pick one to study its cards.</p>
      <div className="grid">
        {DECKS.map(deck => (
          <button key={deck.id} className="deck" onClick={() => onOpen(deck.id)}>
            <h2>{deck.title}</h2>
            <span className="muted">{deck.blurb}</span>
            <span className="badge">{deck.cards.length} cards · {countDue(deck, states)} to study</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function DeckView({ deck, states, onStudy, onBack }) {
  return (
    <section aria-labelledby="deck-title">
      <button onClick={onBack}>← All decks</button>
      <h2 id="deck-title">{deck.title}</h2>
      <p className="muted">{deck.blurb}</p>
      <button className="primary" onClick={onStudy}>Study {countDue(deck, states)} cards</button>
      <ul className="cardlist">
        {deck.cards.map(card => (
          <li key={card.id}>
            <strong>{card.term}</strong> <span className="badge">{states[card.id] ? dueLabel(states[card.id]) : 'new'}</span>
            <div>{card.back}</div>
            {card.example && <pre><code>{card.example}</code></pre>}
          </li>
        ))}
      </ul>
    </section>
  );
}
