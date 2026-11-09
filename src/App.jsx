import { useEffect, useState } from 'react';
import { DECKS, findDeck, allCards } from './lib/decks.js';
import { load, save, recordReview, stats } from './lib/progress.js';
import { review, dueQueue } from './lib/srs.js';
import { importDeck } from './lib/share.js';
import Study from './components/Study.jsx';
import { Banner, Sidebar } from './components/Shell.jsx';
import { DeckList, DeckView, countDue } from './components/Decks.jsx';
import DeckPicker from './components/DeckPicker.jsx';

const DECKS_KEY = 'total-recall:decks';
function loadCustom() {
  try {
    const list = JSON.parse(localStorage.getItem(DECKS_KEY) || '[]');
    return Array.isArray(list) ? list.map(d => importDeck(JSON.stringify(d)).deck && { ...d, custom: true }).filter(Boolean) : [];
  } catch { return []; }
}

export default function App() {
  const [page, setPage] = useState('study');
  const [openId, setOpenId] = useState(null);
  const [progress, setProgress] = useState(() => load());
  const states = progress.states;
  useEffect(() => { save(progress); }, [progress]);
  const [custom, setCustom] = useState(loadCustom);
  useEffect(() => { try { localStorage.setItem(DECKS_KEY, JSON.stringify(custom)); } catch { /* storage off */ } }, [custom]);
  const decks = [...DECKS, ...custom];
  const deck = openId ? findDeck(openId, decks) : null;

  // A study session is a snapshot of the cards to go through, taken when it starts.
  const [session, setSession] = useState(() => {
    const first = decks.find(d => countDue(d, states) > 0) || decks[0];
    return { deckId: first.id, queue: dueQueue(first.cards, states), n: 0 };
  });
  const studyDeck = findDeck(session.deckId, decks) || decks[0];

  function startSession(deckId) {
    const d = findDeck(deckId, decks) || decks[0];
    setSession(s => ({ deckId: d.id, queue: dueQueue(d.cards, progress.states), n: s.n + 1 }));
    setPage('study');
    setOpenId(null);
  }
  function addDeck(d) { setCustom(list => [...list, d]); }
  function removeDeck(id) {
    setCustom(list => list.filter(d => d.id !== id));
    setOpenId(null);
    if (session.deckId === id) startSession(DECKS[0].id);
  }
  function rate(card, grade) {
    setProgress(prev => recordReview(prev, card.id, review(prev.states[card.id], grade)));
  }
  function go(id) { setPage(id); setOpenId(null); }

  let content;
  if (page === 'study') {
    content = (
      <div className="study-grid">
        <Study key={session.n} deck={studyDeck} decks={decks} queue={session.queue} states={states}
          onRate={rate} onPickDeck={startSession} onRestart={() => startSession(studyDeck.id)} />
        <DeckPicker decks={decks} states={states} current={studyDeck.id} onPick={startSession} />
      </div>
    );
  } else if (page === 'progress') content = <Stats progress={progress} />;
  else if (page === 'settings' || page === 'about') content = <section className="panel"><h2>{page === 'about' ? 'About' : 'Settings'}</h2><p className="muted">Coming soon.</p></section>;
  else if (deck) content = <DeckView deck={deck} states={states} onStudy={() => startSession(deck.id)} onBack={() => setOpenId(null)} onRemove={removeDeck} />;
  else content = <DeckList decks={decks} states={states} onOpen={setOpenId} onImport={addDeck} />;

  return (
    <div className="app">
      <Banner decks={decks} />
      <div className="layout">
        <Sidebar page={page} onPage={go} />
        <main>{content}</main>
      </div>
    </div>
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
