// Spaced repetition, based on the SM-2 method: each card has an interval (days until it's due again),
// an ease (how fast that interval grows) and a count of correct reviews in a row. After you rate a card,
// review() returns its new state; a card you forgot comes back in 10 minutes, one you knew waits longer each time.

const DAY = 24 * 60 * 60 * 1000;
export const GRADES = ['again', 'hard', 'good', 'easy'];
export const MIN_EASE = 1.3;

export function newCardState() {
  return { reps: 0, interval: 0, ease: 2.5, due: 0, lapses: 0 };
}

// grade: 'again' | 'hard' | 'good' | 'easy'; now: a timestamp in milliseconds.
export function review(state = newCardState(), grade, now = Date.now()) {
  if (!GRADES.includes(grade)) throw new Error(`Unknown grade: ${grade}`);
  const s = { ...newCardState(), ...state };

  if (grade === 'again') {
    return { ...s, reps: 0, interval: 0, lapses: s.lapses + 1, ease: Math.max(MIN_EASE, s.ease - 0.2), due: now + 10 * 60 * 1000, last: now };
  }

  let interval;
  if (s.reps === 0) interval = grade === 'easy' ? 4 : 1;
  else if (s.reps === 1) interval = grade === 'hard' ? 3 : 6;
  else interval = s.interval * (grade === 'hard' ? 1.2 : grade === 'easy' ? s.ease * 1.3 : s.ease);

  const easeChange = { hard: -0.15, good: 0, easy: 0.15 }[grade];
  const ease = Math.max(MIN_EASE, s.ease + easeChange);
  interval = Math.max(1, Math.round(interval));
  return { ...s, reps: s.reps + 1, interval, ease: Math.round(ease * 100) / 100, due: now + interval * DAY, last: now };
}

export function isDue(state, now = Date.now()) {
  return !state || (state.due || 0) <= now;
}

// The cards to study now: cards that are due (most overdue first), then up to `newLimit` cards never seen.
export function dueQueue(cards, states = {}, now = Date.now(), newLimit = 10) {
  const seen = cards.filter(c => states[c.id] && states[c.id].reps + states[c.id].lapses > 0);
  const fresh = cards.filter(c => !states[c.id] || states[c.id].reps + states[c.id].lapses === 0);
  const due = seen.filter(c => isDue(states[c.id], now)).sort((a, b) => states[a.id].due - states[b.id].due);
  return [...due, ...fresh.slice(0, newLimit)];
}

// A friendly "when is this due" label for the UI.
export function dueLabel(state, now = Date.now()) {
  if (!state || !state.due || state.due <= now) return 'due now';
  const mins = Math.round((state.due - now) / 60000);
  if (mins < 60) return `in ${mins} min`;
  const days = Math.round((state.due - now) / DAY);
  if (days < 1) return `in ${Math.round(mins / 60)} h`;
  return days === 1 ? 'tomorrow' : `in ${days} days`;
}
