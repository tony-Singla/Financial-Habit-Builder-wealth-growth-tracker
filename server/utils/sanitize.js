// Validates and cleans the per-user data document before it is saved.
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH = /^\d{4}-\d{2}$/;

const bad = (msg) => Object.assign(new Error(msg), { status: 400 });
const obj = (x) => (x && typeof x === 'object' ? x : {});
const str = (s, n) => (typeof s === 'string' ? s.trim().slice(0, n) : '');
const amount = (n, max) => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= max;
const list = (a, max) => Array.isArray(a) && a.length <= max;

module.exports = function sanitize(d) {
  const { tx, habits, goals, assets, hist } = obj(d);
  if (!list(tx, 5000) || !list(habits, 100) || !list(goals, 100) || !list(assets, 200) || !list(hist, 240)) {
    throw bad('Data is missing, too large or malformed.');
  }
  return {
    tx: tx.map((t) => {
      t = obj(t);
      if (!['income', 'expense'].includes(t.type) || !DATE.test(t.date) || !(t.amt > 0) || !amount(t.amt, 1e8)) {
        throw bad('Invalid transaction.');
      }
      return { id: str(t.id, 20), type: t.type, date: t.date, cat: str(t.cat, 30), note: str(t.note, 60), amt: t.amt };
    }),
    habits: habits.map((h) => {
      h = obj(h);
      if (!['daily', 'monthly'].includes(h.freq) || str(h.name, 50).length < 3 || !list(h.log, 4000)) {
        throw bad('Invalid habit.');
      }
      return {
        id: str(h.id, 20),
        name: str(h.name, 50),
        freq: h.freq,
        log: h.log.filter((k) => typeof k === 'string' && (DATE.test(k) || MONTH.test(k))),
      };
    }),
    goals: goals.map((g) => {
      g = obj(g);
      if (!str(g.name, 40) || !(g.target > 0) || !amount(g.target, 1e10) || !amount(g.saved, 1e10) || !DATE.test(g.by)) {
        throw bad('Invalid goal.');
      }
      return { id: str(g.id, 20), name: str(g.name, 40), target: g.target, saved: g.saved, by: g.by };
    }),
    assets: assets.map((a) => {
      a = obj(a);
      if (!['Savings', 'Investment', 'Asset', 'Liability'].includes(a.kind) || !str(a.name, 40) || !amount(a.val, 1e11)) {
        throw bad('Invalid asset.');
      }
      return { id: str(a.id, 20), name: str(a.name, 40), kind: a.kind, val: a.val };
    }),
    hist: hist.map((x) => {
      x = obj(x);
      if (!MONTH.test(x.m) || typeof x.v !== 'number' || !Number.isFinite(x.v)) throw bad('Invalid net worth history.');
      return { m: x.m, v: x.v };
    }),
  };
};
