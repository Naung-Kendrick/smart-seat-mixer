import { TOTAL_STUDENTS, NUM_TABLES, STUDENTS_PER_TABLE } from './students';

// ── helpers ──────────────────────────────────────────────

export function pairKey(a, b) {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

export function getPairCount(matrix, a, b) {
  return matrix[pairKey(a, b)] || 0;
}

export function addPairings(matrix, table) {
  const updated = { ...matrix };
  for (let i = 0; i < table.length; i++) {
    for (let j = i + 1; j < table.length; j++) {
      const key = pairKey(table[i], table[j]);
      updated[key] = (updated[key] || 0) + 1;
    }
  }
  return updated;
}

export function countUniquePairings(matrix) {
  return Object.keys(matrix).length;
}

// ── Fisher–Yates shuffle ─────────────────────────────────

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── single greedy attempt ────────────────────────────────

function tryAssignment(pairMatrix, lastTableMap) {
  const indices = shuffleArray(
    Array.from({ length: TOTAL_STUDENTS }, (_, i) => i)
  );
  const tables = Array.from({ length: NUM_TABLES }, () => []);

  for (const sIdx of indices) {
    let bestTable = -1;
    let bestCost = Infinity;

    // gather unfilled tables in random order
    const candidates = shuffleArray(
      Array.from({ length: NUM_TABLES }, (_, t) => t).filter(
        (t) => tables[t].length < STUDENTS_PER_TABLE
      )
    );

    for (const t of candidates) {
      let cost = 0;
      // penalty: same table as previous round
      if (lastTableMap[sIdx] === t) cost += 50;
      // penalty: repeated pairings with current members
      for (const other of tables[t]) {
        cost += getPairCount(pairMatrix, sIdx, other) * 10;
      }
      if (cost < bestCost) {
        bestCost = cost;
        bestTable = t;
      }
    }

    tables[bestTable].push(sIdx);
  }

  return tables;
}

// ── evaluate total cost ──────────────────────────────────

function evaluateCost(tables, pairMatrix, lastTableMap) {
  let total = 0;
  for (let t = 0; t < tables.length; t++) {
    const table = tables[t];
    for (let i = 0; i < table.length; i++) {
      if (lastTableMap[table[i]] === t) total += 50;
      for (let j = i + 1; j < table.length; j++) {
        total += getPairCount(pairMatrix, table[i], table[j]) * 10;
      }
    }
  }
  return total;
}

// ── main entry – multi-restart greedy ────────────────────

const NUM_ATTEMPTS = 80;

export function smartAssign(pairMatrix, lastTableMap) {
  let bestTables = null;
  let bestCost = Infinity;

  for (let a = 0; a < NUM_ATTEMPTS; a++) {
    const tables = tryAssignment(pairMatrix, lastTableMap);
    const cost = evaluateCost(tables, pairMatrix, lastTableMap);
    if (cost < bestCost) {
      bestCost = cost;
      bestTables = tables;
    }
  }

  return bestTables;
}
