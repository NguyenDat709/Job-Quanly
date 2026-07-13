// Tiny helper that treats a localStorage key like a REST "table".
// Every mock endpoint in index.js is built on top of these 5 functions,
// so the rest of the app never touches localStorage directly.

const NS = "jobportal_";

function readTable(key, fallbackSeed) {
  const raw = localStorage.getItem(NS + key);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(NS + key, JSON.stringify(fallbackSeed));
  return fallbackSeed;
}

function writeTable(key, rows) {
  localStorage.setItem(NS + key, JSON.stringify(rows));
  return rows;
}

// simulate network latency so loading skeletons have something to show
export const delay = (ms = 350) => new Promise((res) => setTimeout(res, ms));

export function getAll(key, seed) {
  return readTable(key, seed);
}

export function getById(key, seed, id) {
  return readTable(key, seed).find((r) => r.id === id) || null;
}

export function insert(key, seed, row) {
  const rows = readTable(key, seed);
  const withId = { id: row.id || `${key}_${Date.now()}`, ...row };
  writeTable(key, [...rows, withId]);
  return withId;
}

export function update(key, seed, id, patch) {
  const rows = readTable(key, seed);
  const next = rows.map((r) => (r.id === id ? { ...r, ...patch } : r));
  writeTable(key, next);
  return next.find((r) => r.id === id);
}

export function remove(key, seed, id) {
  const rows = readTable(key, seed);
  writeTable(key, rows.filter((r) => r.id !== id));
  return true;
}

export function resetAll() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(NS))
    .forEach((k) => localStorage.removeItem(k));
}
