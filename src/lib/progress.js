// Saving progress in the browser and working out streaks and stats. Saved data is never trusted:
// anything missing or malformed falls back to an empty start instead of breaking the app.

const KEY = 'total-recall:v1';

export function emptyProgress() {
  // days: { 'YYYY-MM-DD': cards reviewed that day }; correct: the same, counting only Hard, Good or Easy
  return { states: {}, days: {}, correct: {} };
}

export function load(storage = globalThis.localStorage) {
  try {
    const data = JSON.parse(storage?.getItem(KEY) || 'null');
    if (!data || typeof data !== 'object') return emptyProgress();
    const states = {};
    for (const [id, s] of Object.entries(data.states || {})) {
      if (s && Number.isFinite(s.due) && Number.isFinite(s.interval) && Number.isFinite(s.ease)) states[id] = s;
    }
    return { states, days: dayCounts(data.days), correct: dayCounts(data.correct) };
  } catch {
    return emptyProgress();
  }
}

function dayCounts(raw) {
  const out = {};
  for (const [day, n] of Object.entries(raw && typeof raw === 'object' ? raw : {})) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(day) && Number.isInteger(n) && n > 0) out[day] = n;
  }
  return out;
}

export function save(progress, storage = globalThis.localStorage) {
  try {
    storage?.setItem(KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;                            // private mode or storage full: keep going without saving
  }
}

export function dayKey(ms = Date.now()) {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// grade is optional: when it's anything but 'again', the review also counts as a correct answer.
export function recordReview(progress, cardId, state, now = Date.now(), grade) {
  const day = dayKey(now);
  const correct = { ...(progress.correct || {}) };
  if (grade && grade !== 'again') correct[day] = (correct[day] || 0) + 1;
  return {
    states: { ...progress.states, [cardId]: state },
    days: { ...progress.days, [day]: (progress.days[day] || 0) + 1 },
    correct,
  };
}

function total(counts = {}) {
  return Object.values(counts).reduce((a, b) => a + b, 0);
}

// Reviews per day for the last n days, oldest first (for the progress chart).
export function history(days, n = 14, now = Date.now()) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) out.push(days[dayKey(now - i * 86400000)] || 0);
  return out;
}

// Days in a row with at least one review, counting back from today (or from yesterday, so a streak
// isn't shown as broken before you've studied today).
export function streak(days, now = Date.now()) {
  let count = 0;
  let t = now;
  if (!days[dayKey(t)]) t -= 86400000;
  while (days[dayKey(t)]) {
    count++;
    t -= 86400000;
  }
  return count;
}

// Cards by how well they're known: new (never reviewed), learning (interval under 21 days), mature.
export function stats(cards, states, days, now = Date.now(), correct = {}) {
  let fresh = 0, learning = 0, mature = 0;
  for (const c of cards) {
    const s = states[c.id];
    if (!s || s.reps + (s.lapses || 0) === 0) fresh++;
    else if (s.interval >= 21) mature++;
    else learning++;
  }
  // Mastery: known-well cards count fully and learning cards count half, out of every card.
  const mastery = cards.length ? Math.round(((mature + learning / 2) / cards.length) * 100) : 0;
  return {
    fresh, learning, mature, mastery,
    streak: streak(days, now), today: days[dayKey(now)] || 0,
    studied: total(days), correct: total(correct),
  };
}
