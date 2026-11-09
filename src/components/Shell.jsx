import Logo from './Logo.jsx';
import DeckIcon from './DeckIcon.jsx';

export const PAGES = [
  { id: 'study', label: 'Study', icon: 'M8 5v14l11-7z' },
  { id: 'decks', label: 'Decks', icon: 'M12 3 2 8l10 5 10-5-10-5zm-10 9 10 5 10-5M2 16l10 5 10-5' },
  { id: 'progress', label: 'Progress', icon: 'M5 20V12M12 20V5M19 20v-9' },
  { id: 'settings', label: 'Settings', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8-3 2-1-2-4-2 1-2-1V5h-4v2l-2 1-2-1-2 4 2 1v2l-2 1 2 4 2-1 2 1v2h4v-2l2-1 2 1 2-4-2-1z' },
  { id: 'about', label: 'About', icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-11v6m0-9v.5' },
];

function Icon({ d }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

// The banner across the top: logo, name, tagline, and the decks you can study.
export function Banner({ decks }) {
  return (
    <header className="banner">
      <div className="brand">
        <Logo size={72} />
        <div>
          <h1><span>Total</span><span className="grad">Recall</span></h1>
          <p className="tagline">Study. Remember. Code Better.</p>
        </div>
      </div>
      <p className="pitch"><span className="code-mark" aria-hidden="true">&lt;/&gt;</span>Flashcards to master programming terms, one card at a time.</p>
      <div className="banner-decks" aria-hidden="true">
        {decks.slice(0, 6).map(d => <DeckIcon key={d.id} deck={d} size={34} />)}
      </div>
    </header>
  );
}

// The side menu. On phones it turns into a row of tabs under the banner.
export function Sidebar({ page, onPage }) {
  return (
    <nav className="sidebar" aria-label="Main">
      <div className="side-brand"><Logo size={40} /><span>Total<span className="grad">Recall</span></span></div>
      <ul>
        {PAGES.map(p => (
          <li key={p.id}>
            <button className={page === p.id ? 'active' : ''} aria-current={page === p.id ? 'page' : undefined} onClick={() => onPage(p.id)}>
              <Icon d={p.icon} /><span>{p.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="side-note"><span className="code-mark" aria-hidden="true">&lt;/&gt;</span>Keep coding.<br />Keep learning.</div>
    </nav>
  );
}
