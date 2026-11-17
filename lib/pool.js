import { QUESTIONS } from "./questions";
import { HIDDEN } from "./bank";
import { generate, randomGenerated, GENERATORS } from "./generators";

export { HIDDEN, QUESTIONS };
export const ALL_WRITTEN = [...QUESTIONS, ...HIDDEN];
export const TEMPLATE_COUNT = Object.keys(GENERATORS).length;

// Look up any problem by id, including generated ones ("GEN-name-seed").
export function findProblem(id) {
  if (id?.startsWith("GEN-")) {
    const [, name, seed] = id.split("-");
    return GENERATORS[name] ? generate(name, +seed) : null;
  }
  return ALL_WRITTEN.find((q) => q.id === id) || null;
}

// Pick the next problem for practice: unseen hidden problems first, then
// generated variants mixed in, then anything. `seen` is a set of ids.
export function nextProblem({ topic = "all", kinds = null, seen = new Set(), genShare = 0.35, exclude = new Set() }) {
  const fits = (q) => (topic === "all" || q.topic === topic) && (!kinds || kinds.includes(q.kind)) && !exclude.has(q.id);
  const unseenHidden = HIDDEN.filter((q) => fits(q) && !seen.has(q.id));
  const useGen = Math.random() < genShare || unseenHidden.length === 0;
  if (useGen) {
    const g = randomGenerated(topic, kinds);
    if (g) return g;
  }
  if (unseenHidden.length) return unseenHidden[Math.floor(Math.random() * unseenHidden.length)];
  const unseenAny = ALL_WRITTEN.filter((q) => fits(q) && !seen.has(q.id));
  const pool = unseenAny.length ? unseenAny : ALL_WRITTEN.filter(fits);
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : randomGenerated("all", null);
}
