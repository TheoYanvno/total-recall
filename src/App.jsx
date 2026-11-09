import { useEffect, useState } from 'react';
import { DECKS, findDeck, allCards } from './lib/decks.js';
import { load, save, recordReview, emptyProgress } from './lib/progress.js';
import { review } from './lib/srs.js';
import { importDeck } from './lib/share.js';
import { buildQueue, CHALLENGE_SECONDS } from './lib/modes.js';
import Study from './components/Study.jsx';
import { Banner, Sidebar } from './components/Shell.jsx';
import { DeckList, DeckView, countDue } from './components/Decks.jsx';
import DeckPicker from './components/DeckPicker.jsx';
import { ProgressPanel, ModesPanel, ProgressPage, SettingsPage, AboutPage } from './components/Panels.jsx';

const DECKS_KEY = 'total-recall:decks';
const SETTINGS_KEY = 'total-recall:settings';

function loadCustom() {
  try {
    const list = JSON.parse(localStorage.getItem(DECKS_KEY) || '[]');
    return Array.isArray(list) ? list.map(d => importDeck(JSON.stringify(d)).deck && { ...d, custom: true }).filter(Boolean) : [];
  } catch { return []; }
}

function loadSettings() {
  const fallback = { theme: 'dark', newLimit: 10 };
  try {
    const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
    return {
      theme: s.theme === 'light' ? 'light' : 'dark',
      newLimit: [5, 10, 20].includes(s.newLimit) ? s.newLimit : 10,
    };
  } catch { return fallback; }
}

export default function App() {
  const [page, setPage] = useState('study');
  const [openId, setOpenId] = useState(null);
  const [progress, setProgress] = useState(() => load());
  const states = progress.states;
  useEffect(() => { save(progress); }, [progress]);
  const [custom, setCustom] = useState(loadCustom);
  useEffect(() => { try { localStorage.setItem(DECKS_KEY, JSON.stringify(custom)); } catch { /* storage off */ } }, [custom]);
  const [settings, setSettings] = useState(loadSettings);
  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch { /* storage off */ }
  }, [settings]);

  const decks = [...DECKS, ...custom];
  const cards = allCards(decks);
  const deck = openId ? findDeck(openId, decks) : null;

  // A study session is a snapshot of the cards to go through, taken when it starts.
  const [session, setSession] = useState(() => {
    const first = decks.find(d => countDue(d, states) > 0) || decks[0];
    return { deckId: first.id, mode: 'flashcards', queue: buildQueue('flashcards', { deck: first, decks, states, newLimit: settings.newLimit }), n: 0 };
  });
  const studyDeck = findDeck(session.deckId, decks) || decks[0];

  function startSession(deckId = session.deckId, mode = session.mode) {
    const d = findDeck(deckId, decks) || decks[0];
    const queue = buildQueue(mode, { deck: d, decks, states: progress.states, newLimit: settings.newLimit });
    setSession(s => ({ deckId: d.id, mode, queue, n: s.n + 1 }));
    setPage('study');
    setOpenId(null);
  }
  function addDeck(d) { setCustom(list => [...list, d]); }
  function removeDeck(id) {
    setCustom(list => list.filter(d => d.id !== id));
    setOpenId(null);
    if (session.deckId === id) startSession(DECKS[0].id, 'flashcards');
  }
  function rate(card, grade) {
    setProgress(prev => recordReview(prev, card.id, review(prev.states[card.id], grade), Date.now(), grade));
  }
  function resetProgress() {
    setProgress(emptyProgress());
    const d = studyDeck;
    setSession(s => ({ ...s, queue: buildQueue(s.mode, { deck: d, decks, states: {}, newLimit: settings.newLimit }), n: s.n + 1 }));
  }
  function go(id) { setPage(id); setOpenId(null); }

  let content;
  if (page === 'study') {
    const mixed = session.mode === 'mixed';
    content = (
      <>
        <div className="study-grid">
          <Study key={session.n} deck={mixed ? null : studyDeck} decks={decks} queue={session.queue} states={states}
            title={mixed ? 'Mixed: every deck' : undefined}
            timeLimit={session.mode === 'challenge' ? CHALLENGE_SECONDS : undefined}
            onRate={rate} onPickDeck={id => startSession(id, mixed ? 'flashcards' : session.mode)} onRestart={() => startSession()} />
          <DeckPicker decks={decks} states={states} current={mixed ? null : studyDeck.id}
            onPick={id => startSession(id, mixed ? 'flashcards' : session.mode)} />
        </div>
        <div className="bottom-grid">
          <ProgressPanel cards={cards} progress={progress} onMore={() => go('progress')} />
          <ModesPanel current={session.mode} onPick={mode => startSession(session.deckId, mode)} />
        </div>
      </>
    );
  } else if (page === 'progress') content = <ProgressPage decks={decks} cards={cards} progress={progress} />;
  else if (page === 'settings') content = <SettingsPage settings={settings} onChange={setSettings} onReset={resetProgress} />;
  else if (page === 'about') content = <AboutPage />;
  else if (deck) content = <DeckView deck={deck} states={states} onStudy={() => startSession(deck.id, 'flashcards')} onBack={() => setOpenId(null)} onRemove={removeDeck} />;
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
