import DeckIcon from './DeckIcon.jsx';
import { countDue } from './Decks.jsx';

// "Choose a Deck": every deck with its card count and how many are ready to study.
export default function DeckPicker({ decks, states, current, onPick }) {
  return (
    <section className="panel picker" aria-labelledby="picker-title">
      <h2 id="picker-title" className="panel-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 2 8l10 5 10-5-10-5zm-10 9 10 5 10-5M2 16l10 5 10-5" /></svg>
        Choose a Deck
      </h2>
      <ul>
        {decks.map(d => (
          <li key={d.id}>
            <button className={d.id === current ? 'active' : ''} aria-pressed={d.id === current} onClick={() => onPick(d.id)}>
              <DeckIcon deck={d} size={34} />
              <span className="picker-text">
                <strong>{d.title}</strong>
                <small>{d.cards.length} cards · {countDue(d, states)} to study</small>
              </span>
              <span className="chev" aria-hidden="true">›</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
