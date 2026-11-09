import { useEffect, useState } from 'react';
import { DECKS, findDeck, allCards } from './lib/decks.js';
import { load, save, recordReview, stats } from './lib/progress.js';
import { review, dueQueue, dueLabel } from './lib/srs.js';
import Study from './components/Study.jsx';
import { exportDeck, importDeck } from './lib/share.js';

const DECKS_KEY = 'total-recall:decks';
function loadCustom() {
  try {
    const list = JSON.parse(localStorage.getItem(DECKS_KEY) || '[]');
    return Array.isArray(list) ? list.map(d => importDeck(JSON.stringify(d)).deck && { ...d, custom: true }).filter(Boolean) : [];
  } catch { return []; }
}

export default function App() {
  const [openId, setOpenId] = useState(null);
  const [studyQueue, setStudyQueue] = useState(null);
  const [progress, setProgress] = useState(() => load());
  const states = progress.states;
  useEffect(() => { save(progress); }, [progress]);
  const [custom, setCustom] = useState(loadCustom);
  useEffect(() => { try { localStorage.setItem(DECKS_KEY, JSON.stringify(custom)); } catch { /* storage off */ } }, [custom]);
  const decks = [...DECKS, ...custom];
  const deck = openId ? findDeck(openId, decks) : null;

  function addDeck(d) { setCustom(list => [...list, d]); }
  function removeDeck(id) { setCustom(list => list.filter(d => d.id !== id)); setOpenId(null); }

  function startStudy(d) {
    setStudyQueue(dueQueue(d.cards, states));
  }

  function rate(card, grade) {
    setProgress(prev => recordReview(prev, card.id, review(prev.states[card.id], grade)));
  }

  let content;
  if (studyQueue) content = <Study queue={studyQueue} states={states} onRate={rate} onExit={() => setStudyQueue(null)} />;
  else if (deck) content = <DeckView deck={deck} states={states} onStudy={() => startStudy(deck)} onBack={() => setOpenId(null)} onRemove={removeDeck} />;
  else content = <><Stats progress={progress} /><DeckList decks={decks} states={states} onOpen={setOpenId} onImport={addDeck} /></>;

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

function DeckList({ decks, states, onOpen, onImport }) {
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
    <section aria-labelledby="decks-title">
      <h2 id="decks-title">Decks</h2>
      <p className="muted">Each deck follows a CodeForge lesson. Pick one to study its cards.</p>
      <div className="grid">
        {decks.map(deck => (
          <button key={deck.id} className="deck" onClick={() => onOpen(deck.id)}>
            <h2>{deck.title}</h2>
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

function DeckView({ deck, states, onStudy, onBack, onRemove }) {
  function download() {
    const url = URL.createObjectURL(new Blob([exportDeck(deck)], { type: 'application/json' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `${deck.id}.json` });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section aria-labelledby="deck-title">
      <button onClick={onBack}>← All decks</button>
      <h2 id="deck-title">{deck.title}</h2>
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

function Stats({ progress }) {
  const s = stats(allCards(), progress.states, progress.days);
  return (
    <section className="stats" aria-label="Your progress">
      <div><strong>{s.streak}</strong><span>day streak 🔥</span></div>
      <div><strong>{s.today}</strong><span>reviewed today</span></div>
      <div><strong>{s.fresh}</strong><span>new</span></div>
      <div><strong>{s.learning}</strong><span>learning</span></div>
      <div><strong>{s.mature}</strong><span>known well</span></div>
    </section>
  );
}
