import { useEffect, useRef, useState } from 'react';
import { GRADES, dueLabel } from '../lib/srs.js';
import DeckIcon from './DeckIcon.jsx';

const BUTTONS = {
  again: { label: 'Again', sub: 'Forgot', icon: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5' },
  hard: { label: 'Hard', sub: 'Barely', icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 15h8' },
  good: { label: 'Good', sub: 'Got it', icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 12h8' },
  easy: { label: 'Easy', sub: 'Knew it', icon: 'M4 12l5 5L20 6' },
};

function Icon({ d, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

// The study panel: pick a deck, flip each card, rate it. Keyboard: Space or Enter flips, 1-4 rate
// (Again, Hard, Good, Easy), F toggles full screen.
export default function Study({ deck, decks, queue, states, onRate, onPickDeck, onRestart, title, timeLimit }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [left, setLeft] = useState(timeLimit || null);
  const panel = useRef(null);
  const timeUp = left === 0;
  const card = timeUp ? null : queue[index];

  useEffect(() => {
    if (!timeLimit || timeUp || index >= queue.length) return;
    const t = setInterval(() => setLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [timeLimit, timeUp, index >= queue.length]);

  function rate(grade) {
    if (!card || !flipped) return;
    onRate(card, grade);
    setFlipped(false);
    setIndex(i => i + 1);
  }

  function fullscreen() {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else panel.current?.requestFullscreen?.().catch(() => {});
  }

  useEffect(() => {
    function onKey(e) {
      if (e.target.closest && e.target.closest('input, textarea, select')) return;
      if (e.key === ' ' || e.key === 'Enter') {
        if (e.target.closest && e.target.closest('button') && !e.target.closest('.flashcard')) return;
        e.preventDefault(); if (card) setFlipped(f => !f);
      } else if (['1', '2', '3', '4'].includes(e.key)) rate(GRADES[Number(e.key) - 1]);
      else if (e.key === 'f' || e.key === 'F') fullscreen();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const total = queue.length;
  const done = Math.min(index, total);
  return (
    <section className="panel study" ref={panel} aria-labelledby="study-heading">
      <h2 id="study-heading" className="sr-only">{title || 'Study'}</h2>
      <div className="study-top">
        <label className="deck-select">
          {deck && <DeckIcon deck={deck} size={26} />}
          <span className="sr-only">Deck</span>
          <select value={deck ? deck.id : ''} onChange={e => onPickDeck(e.target.value)}>
            {!deck && <option value="">{title}</option>}
            {decks.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
          </select>
        </label>
        {left !== null && <span className={`timer${left <= 15 ? ' low' : ''}`} aria-live="off">⏱ {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</span>}
        <div className="session-progress" aria-label={`${done} of ${total} cards done`}>
          <span>{Math.min(index + 1, total)} / {total}</span>
          <span className="bar"><span style={{ width: total ? `${(done / total) * 100}%` : '0%' }} /></span>
        </div>
        <button className="icon-btn" onClick={fullscreen} aria-label="Full screen (F)" title="Full screen (F)">
          <Icon d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
        </button>
      </div>

      {!card ? (
        <div className="flashcard done-card" aria-live="polite">
          <span className="pill">{timeUp ? "Time's up" : total ? 'Session done' : 'Nothing due'}</span>
          <h3>{timeUp ? `${done} card${done === 1 ? '' : 's'} in ${Math.round(timeLimit / 60)} minutes ⚡` : total ? 'All caught up 🎉' : 'No cards to study here right now'}</h3>
          <p className="muted">{timeUp ? 'Try again to beat it.' : total ? `You reviewed ${total} card${total === 1 ? '' : 's'}. Cards come back when they're due.` : 'Pick another deck or study mode.'}</p>
          {total > 0 && <button className="primary" onClick={onRestart}>{timeUp ? 'Try again' : 'Check for more'}</button>}
        </div>
      ) : (
        <button className={`flashcard${flipped ? ' flipped' : ''}`} onClick={() => setFlipped(f => !f)} aria-label={flipped ? `Hide the answer for ${card.term}` : `Show the answer for ${card.term}`}>
          <span className="pill">{flipped ? 'Definition' : 'Term'}</span>
          <span className={`term${flipped ? ' small-term' : ''}`}><span className="grad">{card.term}</span></span>
          {flipped ? (
            <span className="answer" aria-live="polite">
              <span className="divider" />
              <span>{card.back}</span>
              {card.example && <pre><code>{card.example}</code></pre>}
            </span>
          ) : (
            <span className="muted hint">Press Space or tap to flip</span>
          )}
        </button>
      )}

      <div className="grades" role="group" aria-label="How well did you know it?">
        {GRADES.map((g, i) => (
          <button key={g} className={`grade ${g}`} disabled={!card || !flipped} onClick={() => rate(g)}>
            <Icon d={BUTTONS[g].icon} />
            <span><strong>{BUTTONS[g].label}</strong><small>{BUTTONS[g].sub} · <kbd>{i + 1}</kbd></small></span>
          </button>
        ))}
      </div>
      {card && <p className="muted small">Last seen: {states[card.id] ? dueLabel(states[card.id]) : 'new card'}</p>}
    </section>
  );
}
