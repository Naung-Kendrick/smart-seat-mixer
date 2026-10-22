const STORAGE_KEY = 'seatMixer_data';

const defaultState = () => ({
  rounds: [],        // { tables: [[idx,...], ...], timestamp: ISO }
  pairMatrix: {},    // "i-j" -> count
  lastTableMap: {},  // studentIdx -> last table number
});

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.rounds && parsed?.pairMatrix && parsed?.lastTableMap) {
        return parsed;
      }
    }
  } catch {
    /* corrupt data — reset */
  }
  return defaultState();
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return defaultState();
}
