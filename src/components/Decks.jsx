import { useState } from 'react';
import { dueQueue, dueLabel } from '../lib/srs.js';
import { exportDeck, importDeck } from '../lib/share.js';
import DeckIcon from './DeckIcon.jsx';

export function countDue(deck, states) {
  return dueQueue(deck.cards, states, Date.now(), Infinity).length;
}

export function DeckList({ decks, states, onOpen, onImport }) {
  const [message, setMessage] = useState('');
  async function pick(e) {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 1_000_000) return setMessage('That file is over 1 MB, too big for a deck.');
    const { deck, error } = importDeck(await file.text(), new Set(decks.map(d => d.id)));
    if (error) return setMessage(error);
    onImport(deck);
    setMessage(`Imported "${deck.title}" with ${deck.cards.length} cards.`);
  }
  return (
    <section className="panel" aria-labelledby="decks-title">
      <h2 id="decks-title">Decks</h2>
      <p className="muted">Each deck covers one part of learning web development. Pick one to see its cards.</p>
      <div className="grid">
        {decks.map(deck => (
          <button key={deck.id} className="deck" onClick={() => onOpen(deck.id)}>
            <span className="deck-head"><DeckIcon deck={deck} /><strong>{deck.title}</strong></span>
            <span className="muted">{deck.blurb}</span>
            <span className="badge">{deck.cards.length} cards · {countDue(deck, states)} to study{deck.custom ? ' · imported' : ''}</span>
          </button>
        ))}
      </div>
      <p className="importer">
        <label className="filebtn">Import a deck (JSON)<input type="file" accept="application/json,.json" onChange={pick} /></label>
        <span className="muted" role="status">{message}</span>
      </p>
    </section>
  );
}

export function DeckView({ deck, states, onStudy, onBack, onRemove }) {
  function download() {
    const url = URL.createObjectURL(new Blob([exportDeck(deck)], { type: 'application/json' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `${deck.id}.json` });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section className="panel" aria-labelledby="deck-title">
      <button onClick={onBack}>← All decks</button>
      <h2 id="deck-title" className="deck-head"><DeckIcon deck={deck} />{deck.title}</h2>
      <p className="muted">{deck.blurb}</p>
      <div className="row">
        <button className="primary" onClick={onStudy}>Study {countDue(deck, states)} cards</button>
        <button onClick={download}>Export as JSON</button>
        {deck.custom && <button onClick={() => onRemove(deck.id)}>Remove this deck</button>}
      </div>
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
