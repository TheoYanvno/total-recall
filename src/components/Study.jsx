import { useEffect, useState } from 'react';
import { GRADES, dueLabel } from '../lib/srs.js';

const LABELS = { again: 'Again', hard: 'Hard', good: 'Good', easy: 'Easy' };

// One study session: show the term, flip to see the answer, then rate it. Keyboard: Space flips,
// 1-4 rate (Again, Hard, Good, Easy), Escape leaves.
export default function Study({ queue, states, onRate, onExit }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = queue[index];

  function rate(grade) {
    if (!card || !flipped) return;
    onRate(card, grade);
    setFlipped(false);
    setIndex(i => i + 1);
  }

  useEffect(() => {
    function onKey(e) {
      if (e.target.closest && e.target.closest('input, textarea')) return;
      if (e.key === 'Escape') onExit();
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped(f => !f); }
      else if (['1', '2', '3', '4'].includes(e.key)) rate(GRADES[Number(e.key) - 1]);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!card) {
    return (
      <section className="study done" aria-live="polite">
        <h2>All caught up 🎉</h2>
        <p className="muted">You reviewed {queue.length} card{queue.length === 1 ? '' : 's'}. Come back when more are due.</p>
        <button className="primary" onClick={onExit}>Back to decks</button>
      </section>
    );
  }

  return (
    <section className="study" aria-labelledby="study-term">
      <div className="study-top">
        <button onClick={onExit}>← Stop</button>
        <span className="muted">{index + 1} of {queue.length}</span>
      </div>
      <button className={`flashcard${flipped ? ' flipped' : ''}`} onClick={() => setFlipped(f => !f)} aria-label={flipped ? 'Hide the answer' : 'Show the answer'}>
        <span id="study-term" className="term">{card.term}</span>
        {flipped ? (
          <span className="answer" aria-live="polite">
            <span>{card.back}</span>
            {card.example && <pre><code>{card.example}</code></pre>}
          </span>
        ) : (
          <span className="muted hint">Press Space or tap to flip</span>
        )}
      </button>
      {flipped && (
        <div className="grades" role="group" aria-label="How well did you know it?">
          {GRADES.map((g, i) => (
            <button key={g} className={`grade ${g}`} onClick={() => rate(g)}>
              <kbd>{i + 1}</kbd> {LABELS[g]}
            </button>
          ))}
        </div>
      )}
      <p className="muted small">Last seen: {states[card.id] ? dueLabel(states[card.id]) : 'new card'}</p>
    </section>
  );
}
