import { useState } from 'react';
import { MODES } from '../lib/modes.js';
import { history, stats } from '../lib/progress.js';
import DeckIcon from './DeckIcon.jsx';

const MODE_ICONS = {
  flashcards: 'M8 4h11v14H8zM5 7v14h11',
  quick: 'M13 2 4 14h7l-1 8 9-12h-7z',
  mixed: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-4a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0-4a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  challenge: 'M12 22a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8v5l3 2M9 2h6',
};

function Icon({ d, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function Ring({ percent }) {
  const r = 34, c = 2 * Math.PI * r;
  return (
    <svg className="ring" width="96" height="96" viewBox="0 0 84 84" aria-hidden="true">
      <circle cx="42" cy="42" r={r} fill="none" stroke="rgba(34,211,238,.15)" strokeWidth="8" />
      <circle cx="42" cy="42" r={r} fill="none" stroke="url(#tr-ring)" strokeWidth="8" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - percent / 100)} transform="rotate(-90 42 42)" />
      <defs><linearGradient id="tr-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#14b8a6" /></linearGradient></defs>
    </svg>
  );
}

function Spark({ values }) {
  const w = 200, h = 80, max = Math.max(1, ...values);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * (w - 8) + 4, h - 6 - (v / max) * (h - 16)]);
  const line = pts.map(p => p.join(',')).join(' ');
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img"
      aria-label={`Cards reviewed each day for the last ${values.length} days: ${values.join(', ')}`}>
      <defs><linearGradient id="tr-spark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="rgba(99,102,241,.45)" /><stop offset="1" stopColor="rgba(99,102,241,0)" /></linearGradient></defs>
      <polygon points={`4,${h} ${line} ${w - 4},${h}`} fill="url(#tr-spark)" />
      <polyline points={line} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map(([x, y], i) => values[i] > 0 && <circle key={i} cx={x} cy={y} r="3" fill="#a855f7" />)}
    </svg>
  );
}

// "Your Progress": overall mastery, cards studied, correct answers, the streak and the last 14 days.
export function ProgressPanel({ cards, progress, onMore }) {
  const s = stats(cards, progress.states, progress.days, Date.now(), progress.correct);
  return (
    <section className="panel progress-panel" aria-labelledby="progress-title">
      <h2 id="progress-title" className="panel-title">
        <Icon d="M5 20V12M12 20V5M19 20v-9" size={20} /> Your Progress
        {onMore && <button className="link-btn" onClick={onMore}>Details</button>}
      </h2>
      <div className="progress-body">
        <div className="mastery">
          <Ring percent={s.mastery} />
          <strong>{s.mastery}%</strong>
          <span>Overall mastery</span>
        </div>
        <ul className="figures">
          <li><span className="dot blue" aria-hidden="true" /><small>Cards studied</small><strong>{s.studied}</strong></li>
          <li><span className="dot green" aria-hidden="true" /><small>Correct answers</small><strong>{s.correct}</strong></li>
          <li><span aria-hidden="true">🔥</span><small>Current streak</small><strong>{s.streak} day{s.streak === 1 ? '' : 's'}</strong></li>
        </ul>
        <Spark values={history(progress.days, 14)} />
      </div>
    </section>
  );
}

export function ModesPanel({ current, onPick }) {
  return (
    <section className="panel modes" aria-labelledby="modes-title">
      <h2 id="modes-title" className="panel-title"><Icon d="M13 2 4 14h7l-1 8 9-12h-7z" size={20} /> Study Modes</h2>
      <div className="mode-grid">
        {MODES.map(m => (
          <button key={m.id} className={m.id === current ? 'active' : ''} aria-pressed={m.id === current} title={m.about} onClick={() => onPick(m.id)}>
            <Icon d={MODE_ICONS[m.id]} size={26} />
            <strong>{m.label}</strong>
            <small>({m.sub})</small>
          </button>
        ))}
      </div>
    </section>
  );
}

// The Progress page: the dashboard panel plus a breakdown by how well cards are known and by deck.
export function ProgressPage({ decks, cards, progress }) {
  const s = stats(cards, progress.states, progress.days, Date.now(), progress.correct);
  return (
    <>
      <ProgressPanel cards={cards} progress={progress} />
      <section className="stats" aria-label="Cards by how well you know them">
        <div><strong>{s.today}</strong><span>reviewed today</span></div>
        <div><strong>{s.fresh}</strong><span>new</span></div>
        <div><strong>{s.learning}</strong><span>learning</span></div>
        <div><strong>{s.mature}</strong><span>known well</span></div>
        <div><strong>{s.studied ? Math.round((s.correct / s.studied) * 100) : 0}%</strong><span>answered right</span></div>
      </section>
      <section className="panel" aria-labelledby="by-deck">
        <h2 id="by-deck">Mastery by deck</h2>
        <ul className="deck-bars">
          {decks.map(d => {
            const m = stats(d.cards, progress.states, {}).mastery;
            return (
              <li key={d.id}>
                <DeckIcon deck={d} size={28} />
                <span className="deck-bar-name">{d.title}</span>
                <span className="bar wide" role="img" aria-label={`${m}% mastered`}><span style={{ width: `${m}%` }} /></span>
                <span className="pct">{m}%</span>
              </li>
            );
          })}
        </ul>
        <p className="muted small">Known-well cards (back in 3 weeks or more) count fully; cards you're still learning count half.</p>
      </section>
    </>
  );
}

export function SettingsPage({ settings, onChange, onReset }) {
  const [sure, setSure] = useState(false);
  return (
    <section className="panel settings" aria-labelledby="settings-title">
      <h2 id="settings-title">Settings</h2>
      <label>Theme
        <select value={settings.theme} onChange={e => onChange({ ...settings, theme: e.target.value })}>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </label>
      <label>New cards per session
        <select value={settings.newLimit} onChange={e => onChange({ ...settings, newLimit: Number(e.target.value) })}>
          {[5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>
      <div className="danger">
        <strong>Reset progress</strong>
        <p className="muted small">Forget every rating, the streak and the history. Imported decks stay.</p>
        {sure ? (
          <div className="row">
            <button className="danger-btn" onClick={() => { onReset(); setSure(false); }}>Yes, reset everything</button>
            <button onClick={() => setSure(false)}>Cancel</button>
          </div>
        ) : <button onClick={() => setSure(true)}>Reset progress…</button>}
      </div>
    </section>
  );
}

export function AboutPage() {
  return (
    <section className="panel about" aria-labelledby="about-title">
      <h2 id="about-title">About TotalRecall</h2>
      <p>TotalRecall is a flashcard app for the words you meet while learning to code: Git, HTML and CSS, JavaScript, React, Python, SQL, and servers and data.</p>
      <h3>How spaced repetition works</h3>
      <p>After you flip a card, rate how well you knew it. Cards you forgot come back in 10 minutes. Cards you knew wait longer each time: a day, then about a week, then weeks. That way you spend your time on the cards you're about to forget.</p>
      <h3>Keyboard shortcuts</h3>
      <ul className="keys">
        <li><kbd>Space</kbd> or <kbd>Enter</kbd> flip the card</li>
        <li><kbd>1</kbd> Again · <kbd>2</kbd> Hard · <kbd>3</kbd> Good · <kbd>4</kbd> Easy</li>
        <li><kbd>F</kbd> full screen</li>
      </ul>
      <h3>Your data</h3>
      <p>Progress and imported decks are saved in this browser only. Nothing is sent anywhere.</p>
      <p className="muted small">Open source under the MIT license: <a href="https://github.com/TheoYanvno/total-recall">github.com/TheoYanvno/total-recall</a></p>
    </section>
  );
}
