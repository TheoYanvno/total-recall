// Saving progress in the browser and working out streaks and stats. Saved data is never trusted:
// anything missing or malformed falls back to an empty start instead of breaking the app.

const KEY = 'total-recall:v1';

export function emptyProgress() {
  return { states: {}, days: {} };          // days: { 'YYYY-MM-DD': cards reviewed that day }
}

export function load(storage = globalThis.localStorage) {
  try {
    const data = JSON.parse(storage?.getItem(KEY) || 'null');
    if (!data || typeof data !== 'object') return emptyProgress();
    const states = {};
    for (const [id, s] of Object.entries(data.states || {})) {
      if (s && Number.isFinite(s.due) && Number.isFinite(s.interval) && Number.isFinite(s.ease)) states[id] = s;
    }
    const days = {};
    for (const [day, n] of Object.entries(data.days || {})) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(day) && Number.isInteger(n) && n > 0) days[day] = n;
    }
    return { states, days };
  } catch {
    return emptyProgress();
  }
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

export function recordReview(progress, cardId, state, now = Date.now()) {
  const day = dayKey(now);
  return {
    states: { ...progress.states, [cardId]: state },
    days: { ...progress.days, [day]: (progress.days[day] || 0) + 1 },
  };
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
export function stats(cards, states, days, now = Date.now()) {
  let fresh = 0, learning = 0, mature = 0;
  for (const c of cards) {
    const s = states[c.id];
    if (!s || s.reps + (s.lapses || 0) === 0) fresh++;
    else if (s.interval >= 21) mature++;
    else learning++;
  }
  return { fresh, learning, mature, streak: streak(days, now), today: days[dayKey(now)] || 0 };
}
