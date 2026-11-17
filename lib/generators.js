// Parametric problem generators. Every answer is computed, not typed, so each
// variant is correct by construction. A seed fully determines a problem, so ids
// like "GEN-bayes-48213" always reproduce the same question.

// ---------- helpers ----------
export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const int = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
const choice = (r, arr) => arr[Math.floor(r() * arr.length)];
const shuffle = (r, arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
// exact fractions as [num, den]
const F = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; };
const add = (a, b) => F(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const sub = (a, b) => F(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const mul = (a, b) => F(a[0] * b[0], a[1] * b[1]);
const div = (a, b) => F(a[0] * b[1], a[1] * b[0]);
const fs = (a) => (a[1] === 1 ? `${a[0]}` : `${a[0]}/${a[1]}`);
const fsd = (a) => (a[1] === 1 ? `${a[0]}` : `${a[0]}/${a[1]} ≈ ${(a[0] / a[1]).toFixed(3)}`);
const sub_ = (name, i) => `${name}_${i}`;

const DIE = [1, 2, 3, 4, 5, 6];

// ---------- probability ----------
function bayesTest(r) {
  const prevDen = choice(r, [10, 20, 25, 50, 100]);
  const prev = F(1, prevDen);
  const sensVal = choice(r, [[9, 10], [19, 20], [49, 50], [4, 5]]);
  const fpVal = choice(r, [[1, 10], [1, 20], [1, 25], [1, 50]]);
  const s = F(...sensVal);
  const fp = F(...fpVal);
  const thing = choice(r, [
    ["a rare disease", "the disease", "tests positive", "a positive test"],
    ["a manufacturing defect", "the defect", "is flagged by the scanner", "a flag"],
    ["a cheating account", "cheating", "is flagged by the detector", "a flag"],
  ]);
  const joint = mul(prev, s);
  const total = add(joint, mul(sub(F(1), prev), fp));
  const ans = div(joint, total);
  return {
    topic: "probability", kind: "compute", difficulty: 2,
    title: "Base rates and a positive result",
    prompt: `${fs(prev)} of a population has ${thing[0]}. A test catches ${thing[1]} with probability ${fs(s)} and wrongly reports it in someone without ${thing[1]} with probability ${fs(fp)}. A randomly chosen person ${thing[2]}. What is the probability they actually have ${thing[1]}?`,
    hints: ["Let D be the event that they have it and T the event of a positive result. You want Pr[D | T].", "Total probability gives Pr[T] = Pr[D]Pr[T|D] + Pr[D̄]Pr[T|D̄]."],
    solutions: [
      { approach: "Bayes' rule", text: `Pr[T] = (${fs(prev)})(${fs(s)}) + (${fs(sub(F(1), prev))})(${fs(fp)}) = ${fs(joint)} + ${fs(mul(sub(F(1), prev), fp))} = ${fs(total)}.\nPr[D | T] = Pr[D]·Pr[T|D] / Pr[T] = (${fs(joint)}) / (${fs(total)}) = ${fsd(ans)}.` },
      { approach: "Imagine a population", text: `Take ${prevDen * sensVal[1] * fpVal[1]} people. ${(prevDen * sensVal[1] * fpVal[1]) / prevDen} have it, and ${((prevDen * sensVal[1] * fpVal[1]) / prevDen) * sensVal[0] / sensVal[1]} of those test positive. Of the other ${(prevDen * sensVal[1] * fpVal[1]) * (prevDen - 1) / prevDen}, ${(prevDen * sensVal[1] * fpVal[1]) * (prevDen - 1) / prevDen * fpVal[0] / fpVal[1]} test positive.\nFraction of positives who have it: ${fsd(ans)}.` },
    ],
    tags: ["Bayes", "total probability"],
  };
}

function twoUrns(r) {
  const a = [int(r, 1, 6), int(r, 1, 6)];
  const b = [int(r, 1, 6), int(r, 1, 6)];
  const pA = choice(r, [[1, 2], [1, 3], [2, 3], [1, 4]]);
  const how = pA[0] * 2 === pA[1] ? "flips a fair coin and uses urn A on heads" : `rolls a die and uses urn A on ${pA[0] * 6 / pA[1] === 1 ? "a 6" : `a ${pA[0] * 6 / pA[1]} or less`}`;
  const PA = F(...pA);
  const PB = sub(F(1), PA);
  const rA = F(a[0], a[0] + a[1]);
  const rB = F(b[0], b[0] + b[1]);
  const joint = mul(PA, rA);
  const tot = add(joint, mul(PB, rB));
  const ans = div(joint, tot);
  return {
    topic: "probability", kind: "compute", difficulty: 1,
    title: "Which urn was it?",
    prompt: `Urn A holds ${a[0]} red and ${a[1]} blue balls. Urn B holds ${b[0]} red and ${b[1]} blue balls. Someone ${how}, and urn B otherwise, then draws one ball uniformly from that urn. The ball is red. What is the probability it came from urn A?`,
    hints: ["Condition on the urn first: Pr[red] = Pr[A]Pr[red|A] + Pr[B]Pr[red|B].", "Then Pr[A | red] = Pr[A]Pr[red|A] / Pr[red]."],
    solutions: [{ approach: "Bayes' rule", text: `Pr[A] = ${fs(PA)}, Pr[red | A] = ${fs(rA)}, Pr[B] = ${fs(PB)}, Pr[red | B] = ${fs(rB)}.\nPr[red] = ${fs(joint)} + ${fs(mul(PB, rB))} = ${fs(tot)}.\nPr[A | red] = (${fs(joint)}) / (${fs(tot)}) = ${fsd(ans)}.` }],
    tags: ["Bayes", "conditional"],
  };
}

function inclusionExclusion(r) {
  const N = choice(r, [60, 90, 100, 120, 150, 180, 200, 210, 300]);
  const [p, q, s] = shuffle(r, [2, 3, 5, 7]).slice(0, 3).sort((x, y) => x - y);
  const c = (d) => Math.floor(N / d);
  const union = c(p) + c(q) + c(s) - c(p * q) - c(p * s) - c(q * s) + c(p * q * s);
  const none = N - union;
  return {
    topic: "probability", kind: "compute", difficulty: 1,
    title: "Divisible by at least one",
    prompt: `An integer is chosen uniformly from {1, 2, …, ${N}}. What is the probability that it is divisible by none of ${p}, ${q}, and ${s}?`,
    hints: ["Count the complement: integers divisible by at least one of them.", `Inclusion–exclusion over three sets. Multiples of d up to ${N}: ⌊${N}/d⌋.`],
    solutions: [{ approach: "Inclusion–exclusion", text: `Let A_d be the multiples of d.\n|A_${p}| + |A_${q}| + |A_${s}| = ${c(p)} + ${c(q)} + ${c(s)} = ${c(p) + c(q) + c(s)}.\nPairwise: |A_${p * q}| + |A_${p * s}| + |A_${q * s}| = ${c(p * q)} + ${c(p * s)} + ${c(q * s)} = ${c(p * q) + c(p * s) + c(q * s)}.\nTriple: |A_${p * q * s}| = ${c(p * q * s)}.\nUnion = ${c(p) + c(q) + c(s)} − ${c(p * q) + c(p * s) + c(q * s)} + ${c(p * q * s)} = ${union}.\nNone: ${N} − ${union} = ${none}, so the probability is ${fsd(F(none, N))}.` }],
    tags: ["inclusion–exclusion", "counting"],
  };
}

function diceConditional(r) {
  const k = int(r, 1, 6);
  const sVal = int(r, Math.max(2, k + 1), Math.min(12, k + 6));
  const all = DIE.flatMap((x) => DIE.map((y) => [x, y]));
  const B = all.filter(([x, y]) => x === k || y === k);
  const AB = B.filter(([x, y]) => x + y === sVal);
  const ans = F(AB.length, B.length);
  return {
    topic: "probability", kind: "compute", difficulty: 1,
    title: "Two dice, one clue",
    prompt: `Two fair dice are rolled. You are told that at least one die shows a ${k}. What is the probability that the sum is ${sVal}?`,
    hints: ["The condition leaves only some of the 36 outcomes. Count them; don't forget not to double count (k, k).", "Among those, count the outcomes with the right sum."],
    solutions: [{ approach: "Restrict the sample space", text: `Outcomes with at least one ${k}: 6 + 6 − 1 = ${B.length}.\nAmong them, sum ${sVal}: ${AB.map(([x, y]) => `(${x},${y})`).join(", ") || "none"}, which is ${AB.length}.\nPr = ${fs(ans)}.` }],
    tags: ["conditional", "dice"],
  };
}

function independenceCheck(r) {
  const all = DIE.flatMap((x) => DIE.map((y) => [x, y]));
  const evA = choice(r, [
    ["the first die is even", ([x]) => x % 2 === 0],
    ["the first die shows at most 2", ([x]) => x <= 2],
    ["the first die shows a 6", ([x]) => x === 6],
    ["the first die is at most 4", ([x]) => x <= 4],
  ]);
  const t = int(r, 4, 10);
  const evB = choice(r, [
    [`the sum is ${t}`, ([x, y]) => x + y === t],
    ["the sum is even", ([x, y]) => (x + y) % 2 === 0],
    ["the sum is 7", ([x, y]) => x + y === 7],
    [`the sum is at least ${t}`, ([x, y]) => x + y >= t],
  ]);
  const a = all.filter(evA[1]).length, b = all.filter(evB[1]).length, ab = all.filter((o) => evA[1](o) && evB[1](o)).length;
  const indep = ab * 36 === a * b;
  return {
    topic: "probability", kind: "short", difficulty: 1,
    title: "Independent or not?",
    prompt: `Roll two fair dice. Let A be the event that ${evA[0]}, and B the event that ${evB[0]}. Are A and B independent? Justify with probabilities.`,
    hints: ["Independence means Pr[A ∩ B] = Pr[A]·Pr[B]. Intuition is not a justification.", "Count outcomes out of 36 for A, B, and A ∩ B."],
    solutions: [{ approach: "Check the product rule", text: `Pr[A] = ${a}/36 = ${fs(F(a, 36))}. Pr[B] = ${b}/36 = ${fs(F(b, 36))}.\nPr[A ∩ B] = ${ab}/36 = ${fs(F(ab, 36))}.\nPr[A]·Pr[B] = ${fs(F(a * b, 1296))}.\n${indep ? "These are equal, so A and B are independent." : "These differ, so A and B are not independent."}` }],
    tags: ["independence"],
  };
}

function distinctBirthdays(r) {
  const n = choice(r, [6, 8, 10, 12]);
  const k = int(r, 3, 4);
  let num = 1;
  for (let i = 0; i < k; i++) num *= n - i;
  const den = n ** k;
  const pAll = F(num, den);
  const label = n === 12 ? "birth months (12, equally likely)" : n === 6 ? "rolls of a fair die" : `${n} equally likely colours`;
  return {
    topic: "probability", kind: "compute", difficulty: 1,
    title: "A repeat among a few",
    prompt: `${k} independent picks are made from ${label}. What is the probability that at least two picks are the same?`,
    hints: ["Compute the complement: all picks different.", `The i-th pick must avoid the i − 1 values already used.`],
    solutions: [
      { approach: "Complement", text: `Pr[all different] = ${Array.from({ length: k }, (_, i) => `${n - i}`).join("·")} / ${n}^${k} = ${num}/${den} = ${fs(pAll)}.\nPr[some repeat] = 1 − ${fs(pAll)} = ${fsd(sub(F(1), pAll))}.` },
      { approach: "Sequential conditioning", text: `Multiply the chances each new pick avoids the earlier ones: ${Array.from({ length: k }, (_, i) => `(${n - i}/${n})`).join("·")} = ${fs(pAll)}. Subtract from 1: ${fs(sub(F(1), pAll))}.` },
    ],
    tags: ["birthday", "complement"],
  };
}

// ---------- expectation ----------
function emptyBins(r) {
  const m = int(r, 3, 6);
  const n = int(r, 3, 6);
  const per = F((m - 1) ** n, m ** n);
  const e = mul(F(m), per);
  return {
    topic: "expectation", kind: "compute", difficulty: 2,
    title: "Expected empty bins",
    prompt: `${n} balls are thrown independently and uniformly into ${m} bins. What is the expected number of empty bins?`,
    hints: ["Use an indicator I_j for \"bin j is empty\".", `Pr[bin j empty] = ((${m}−1)/${m})^${n}. Linearity does the rest; no independence needed.`],
    solutions: [{ approach: "Indicators and linearity", text: `Let I_j = 1 if bin j is empty. Each ball misses bin j with probability ${m - 1}/${m}, independently, so E[I_j] = (${m - 1}/${m})^${n} = ${fs(per)}.\nE[empty] = Σ E[I_j] = ${m}·${fs(per)} = ${fsd(e)}.` }],
    tags: ["linearity", "indicators"],
  };
}

function patternCount(r) {
  const n = int(r, 5, 20);
  const p = F(...choice(r, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]]));
  const q = sub(F(1), p);
  const pat = choice(r, ["HT", "HH", "HTH", "HHT"]);
  let pr = F(1);
  for (const ch of pat) pr = mul(pr, ch === "H" ? p : q);
  const slots = n - pat.length + 1;
  const e = mul(F(slots), pr);
  return {
    topic: "expectation", kind: "compute", difficulty: 1,
    title: "Counting a pattern",
    prompt: `A coin with Pr[heads] = ${fs(p)} is flipped ${n} times. What is the expected number of positions where the pattern ${pat} appears (occurrences may overlap)?`,
    hints: [`There are ${n} − ${pat.length} + 1 starting positions. Put an indicator on each.`, "Overlapping occurrences are dependent, but linearity doesn't care."],
    solutions: [{ approach: "Indicators", text: `For each start i = 1, …, ${slots}, let I_i = 1 if flips i … i+${pat.length - 1} spell ${pat}. Pr = ${[...pat].map((ch) => (ch === "H" ? fs(p) : fs(q))).join("·")} = ${fs(pr)}.\nE = ${slots}·${fs(pr)} = ${fsd(e)}.` }],
    tags: ["linearity", "indicators"],
  };
}

function geometricDie(r) {
  const faces = choice(r, [4, 6, 8, 10, 12]);
  const k = int(r, 1, Math.min(4, faces - 1));
  const p = F(k, faces);
  const e = div(F(1), p);
  const v = div(sub(F(1), p), mul(p, p));
  return {
    topic: "expectation", kind: "compute", difficulty: 1,
    title: "Rolling until it lands",
    prompt: `A fair ${faces}-sided die is rolled until it shows one of ${k === 1 ? "a single chosen face" : `${k} chosen faces`}. Let X be the number of rolls, counting the last one. Find E[X] and Var[X].`,
    hints: ["X is geometric. What is the success probability p?", "E = 1/p and Var = (1 − p)/p²."],
    solutions: [{ approach: "Geometric distribution", text: `p = ${k}/${faces} = ${fs(p)}.\nE[X] = 1/p = ${fs(e)}.\nVar[X] = (1 − p)/p² = (${fs(sub(F(1), p))}) / (${fs(mul(p, p))}) = ${fs(v)}.` }],
    tags: ["geometric"],
  };
}

function binomialChebyshev(r) {
  const n = choice(r, [100, 200, 400, 900, 1600]);
  const p = F(...choice(r, [[1, 2], [1, 4], [1, 5], [1, 10]]));
  const t = choice(r, [10, 20, 30, 40, 50].filter((x) => x * 4 < n));
  const mu = mul(F(n), p);
  const v = mul(mu, sub(F(1), p));
  const bound = div(v, F(t * t));
  return {
    topic: "expectation", kind: "compute", difficulty: 2,
    title: "Chebyshev on a count",
    prompt: `X counts successes in ${n} independent trials, each succeeding with probability ${fs(p)}. Use Chebyshev's inequality to bound Pr[|X − ${fs(mu)}| ≥ ${t}].`,
    hints: ["X is binomial. Find Var[X] first.", "Chebyshev: Pr[|X − E[X]| ≥ a] ≤ Var[X]/a²."],
    solutions: [{ approach: "Binomial variance, then Chebyshev", text: `E[X] = np = ${fs(mu)}. Var[X] = np(1 − p) = ${fs(v)} (variance adds over independent trials).\nPr[|X − ${fs(mu)}| ≥ ${t}] ≤ ${fs(v)} / ${t * t} = ${fsd(bound)}.${bound[0] >= bound[1] ? "\nThe bound is at least 1 here, so it says nothing useful." : ""}` }],
    tags: ["Chebyshev", "binomial", "variance"],
  };
}

function markovShift(r) {
  const c = int(r, 1, 5);
  const mu = int(r, 1, 8);
  const a = mu + int(r, 3, 12);
  const naive = F(mu, a);
  const good = F(mu + c, a + c);
  return {
    topic: "expectation", kind: "short", difficulty: 2,
    title: "Markov needs a floor",
    prompt: `A random variable Z always satisfies Z ≥ −${c}, and E[Z] = ${mu}. Give the best bound Markov's inequality allows on Pr[Z ≥ ${a}]. Why can't you just write ${mu}/${a}?`,
    hints: ["Markov only applies to non-negative random variables.", `Shift: W = Z + ${c} is non-negative.`],
    solutions: [{ approach: "Shift then apply Markov", text: `Z can be negative, so Markov does not apply to Z directly; ${fs(naive)} is unjustified.\nLet W = Z + ${c} ≥ 0, with E[W] = ${mu + c}.\nPr[Z ≥ ${a}] = Pr[W ≥ ${a + c}] ≤ ${mu + c}/${a + c}${good[1] !== a + c ? ` = ${fs(good)}` : ""}.` }],
    tags: ["Markov"],
  };
}

function couponPartial(r) {
  const n = int(r, 4, 8);
  const k = int(r, 2, n);
  let e = F(0);
  const terms = [];
  for (let i = 0; i < k; i++) { e = add(e, F(n, n - i)); terms.push(`${n}/${n - i}`); }
  return {
    topic: "expectation", kind: "compute", difficulty: 2,
    title: k === n ? "Collect them all" : "Collect some of them",
    prompt: `Each box holds one of ${n} toy types, uniformly and independently. What is the expected number of boxes you open until you have ${k === n ? "all" : k} distinct types?`,
    hints: ["Split the process into phases: phase i ends when you get your i-th new type.", "When you have i − 1 types, each box is new with probability (n − i + 1)/n, so phase i is geometric."],
    solutions: [{ approach: "Sum of geometric phases", text: `Phase i (i = 1, …, ${k}) has success probability (${n} − i + 1)/${n}, so it takes ${n}/(${n} − i + 1) boxes on average.\nE = ${terms.join(" + ")} = ${fsd(e)}.` }],
    tags: ["coupon collector", "geometric", "linearity"],
  };
}

function maxOfDice(r) {
  const s = choice(r, [4, 6, 8]);
  const fn = choice(r, ["max", "min"]);
  let tot = 0;
  for (let x = 1; x <= s; x++) for (let y = 1; y <= s; y++) tot += fn === "max" ? Math.max(x, y) : Math.min(x, y);
  const e = F(tot, s * s);
  const tail = [];
  for (let i = 0; i < s; i++) tail.push(fn === "max" ? `(1 − ${i}²/${s * s})` : `${(s - i) ** 2}/${s * s}`);
  return {
    topic: "expectation", kind: "compute", difficulty: 2,
    title: `Expected ${fn === "max" ? "maximum" : "minimum"} of two dice`,
    prompt: `Two fair ${s}-sided dice are rolled. Let M be the ${fn === "max" ? "larger" : "smaller"} of the two values. Find E[M].`,
    hints: ["Tail sum: E[M] = Σ_{i≥0} Pr[M > i].", fn === "max" ? "Pr[M ≤ i] = (i/s)², so Pr[M > i] = 1 − (i/s)²." : "Pr[M > i] = ((s − i)/s)², since both dice must exceed i."],
    solutions: [
      { approach: "Tail sum", text: `E[M] = Σ_{i=0}^{${s - 1}} Pr[M > i] = ${tail.join(" + ")} = ${fsd(e)}.` },
      { approach: "Direct PMF", text: `Pr[M = m] = ${fn === "max" ? `(2m − 1)/${s * s}` : `(2(${s} − m) + 1)/${s * s}`}. Then E[M] = Σ m·Pr[M = m] = ${tot}/${s * s} = ${fs(e)}.` },
    ],
    tags: ["tail sum", "expectation"],
  };
}

// ---------- graphs and trees ----------
function havelHakimi(seq) {
  const steps = [];
  let s = [...seq].sort((a, b) => b - a);
  while (true) {
    s = s.filter((x) => x > 0).sort((a, b) => b - a);
    if (!s.length) return { ok: true, steps };
    const d = s.shift();
    if (d > s.length) { steps.push(`remove ${d}, but only ${s.length} entries remain`); return { ok: false, steps }; }
    for (let i = 0; i < d; i++) s[i] -= 1;
    if (s.some((x) => x < 0)) return { ok: false, steps };
    steps.push(`remove ${d}, subtract 1 from the next ${d}: (${[...s].sort((a, b) => b - a).join(", ") || "empty"})`);
  }
}
function degreeSequence(r) {
  const n = int(r, 5, 7);
  let seq = Array.from({ length: n }, () => int(r, 1, n - 1)).sort((a, b) => b - a);
  if (r() < 0.35) { // nudge parity to even sometimes so it isn't always the parity trick
    if (seq.reduce((a, b) => a + b, 0) % 2) seq[seq.length - 1] = Math.max(1, seq[seq.length - 1] + (seq[seq.length - 1] > 1 ? -1 : 1));
    seq.sort((a, b) => b - a);
  }
  const sum = seq.reduce((a, b) => a + b, 0);
  const res = sum % 2 ? { ok: false, steps: [] } : havelHakimi(seq);
  const why = sum % 2
    ? `The degree sum is ${sum}, which is odd. The handshake lemma says the sum is 2|E|, so no graph has these degrees.`
    : res.ok
      ? `The sum ${sum} is even. Havel–Hakimi reduces it to all zeros:\n${res.steps.map((s) => `• ${s}`).join("\n")}\nSo a simple graph exists (build it by reversing the steps).`
      : `The sum ${sum} is even, so parity doesn't rule it out. Havel–Hakimi fails:\n${res.steps.map((s) => `• ${s}`).join("\n")}\nA negative entry or too few vertices appears, so no simple graph exists.`;
  return {
    topic: "graphs", kind: "short", difficulty: sum % 2 ? 1 : 2,
    title: "Is this degree sequence possible?",
    prompt: `Is there a simple graph whose vertex degrees are (${seq.join(", ")})? Justify.`,
    hints: ["Check the parity of the degree sum first (handshake lemma).", "If parity is fine, try Havel–Hakimi: remove the largest degree d and subtract 1 from the next d largest."],
    solutions: [{ approach: sum % 2 ? "Handshake parity" : "Havel–Hakimi", text: `${res.ok ? "Yes." : "No."}\n${why}` }],
    tags: ["degree sequence", "handshake"],
  };
}

function treeDegrees(r) {
  const n3 = int(r, 1, 6), n4 = int(r, 0, 4), n5 = int(r, 0, 2), n2 = int(r, 0, 5);
  const leaves = 2 + n3 + 2 * n4 + 3 * n5;
  const n = leaves + n2 + n3 + n4 + n5;
  const parts = [[2, n2], [3, n3], [4, n4], [5, n5]].filter(([, c]) => c > 0);
  return {
    topic: "trees", kind: "compute", difficulty: 2,
    title: "How many leaves?",
    prompt: `A tree has ${parts.map(([d, c]) => `${c} vertices of degree ${d}`).join(", ")}, and every other vertex is a leaf. How many leaves does it have, and how many vertices in total?`,
    hints: ["Let L be the number of leaves. Write n and the degree sum in terms of L.", "Degree sum = 2(n − 1) for a tree."],
    solutions: [{ approach: "Handshake on a tree", text: `Let L = number of leaves. n = L + ${n2 + n3 + n4 + n5}.\nDegree sum = L + ${parts.map(([d, c]) => `${d}·${c}`).join(" + ")} = L + ${2 * n2 + 3 * n3 + 4 * n4 + 5 * n5}.\nTree: degree sum = 2(n − 1) = 2L + ${2 * (n2 + n3 + n4 + n5) - 2}.\nSo L = ${2 * n2 + 3 * n3 + 4 * n4 + 5 * n5} − ${2 * (n2 + n3 + n4 + n5) - 2} = ${leaves}, and n = ${n}.\nCheck with the shortcut L = 2 + Σ (d − 2)·n_d = 2 + ${parts.filter(([d]) => d > 2).map(([d, c]) => `${d - 2}·${c}`).join(" + ")} = ${leaves}.` }],
    tags: ["trees", "degree counting"],
  };
}

function randomGraph(r, n, m) {
  const pairs = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pairs.push([i, j]);
  return shuffle(r, pairs).slice(0, m);
}
function analyse(n, edges) {
  const deg = Array(n).fill(0);
  const adj = Array.from({ length: n }, () => []);
  edges.forEach(([u, v]) => { deg[u]++; deg[v]++; adj[u].push(v); adj[v].push(u); });
  const seen = Array(n).fill(false);
  let comps = 0;
  const color = Array(n).fill(-1);
  let bip = true;
  for (let s = 0; s < n; s++) {
    if (seen[s]) continue;
    comps++;
    const st = [s]; seen[s] = true; color[s] = 0;
    while (st.length) {
      const x = st.pop();
      for (const y of adj[x]) {
        if (!seen[y]) { seen[y] = true; color[y] = 1 - color[x]; st.push(y); }
        else if (color[y] === color[x]) bip = false;
      }
    }
  }
  return { deg, comps, bip, color };
}
function eulerCheck(r) {
  const n = int(r, 5, 7);
  let edges, a;
  for (let tries = 0; tries < 50; tries++) {
    edges = randomGraph(r, n, int(r, n, Math.min(n * 2, (n * (n - 1)) / 2)));
    a = analyse(n, edges);
    if (a.comps === 1) break;
  }
  const L = "abcdefg";
  const odd = a.deg.map((d, i) => [d, i]).filter(([d]) => d % 2).map(([, i]) => L[i]);
  const circuit = a.comps === 1 && odd.length === 0;
  const trail = a.comps === 1 && odd.length <= 2;
  return {
    topic: "graphs", kind: "short", difficulty: 1,
    title: "Euler circuit, trail, or neither?",
    prompt: `A graph has vertices ${L.slice(0, n).split("").join(", ")} and edges\n${edges.map(([u, v]) => `${L[u]}${L[v]}`).join(", ")}.\nDoes it have an Euler circuit? An Euler trail? Is it bipartite? Justify each answer.`,
    hints: ["Write down every degree. Count the odd ones.", "Euler circuit: connected, all degrees even. Trail: connected, 0 or 2 odd vertices. Bipartite: no odd cycle (try 2-colouring)."],
    solutions: [{ approach: "Degrees and colouring", text: `Degrees: ${a.deg.map((d, i) => `${L[i]}:${d}`).join(", ")}. The graph is ${a.comps === 1 ? "connected" : `not connected (${a.comps} components)`}.\nOdd-degree vertices: ${odd.length ? odd.join(", ") : "none"}.\nEuler circuit: ${circuit ? "yes, connected and every degree is even" : odd.length ? `no, ${odd.length} vertices have odd degree` : "no, it is disconnected"}.\nEuler trail: ${trail ? (odd.length === 2 ? `yes, starting at ${odd[0]} and ending at ${odd[1]}` : "yes (the circuit is one)") : "no"}.\nBipartite: ${a.bip ? `yes, sides {${a.color.map((c, i) => (c === 0 ? L[i] : null)).filter(Boolean).join(", ")}} and {${a.color.map((c, i) => (c === 1 ? L[i] : null)).filter(Boolean).join(", ")}}` : "no, 2-colouring by BFS forces two adjacent vertices to share a colour, so there is an odd cycle"}.` }],
    tags: ["Euler", "bipartite", "degrees"],
  };
}

function componentsForest(r) {
  const n = int(r, 12, 60);
  const c = int(r, 2, 6);
  const variant = choice(r, ["forest", "bound"]);
  if (variant === "forest") {
    return {
      topic: "trees", kind: "short", difficulty: 1,
      title: "Edges in a forest",
      prompt: `A forest has ${n} vertices and ${c} connected components. How many edges does it have? Justify.`,
      hints: ["Each component is a tree.", "A tree on n_i vertices has n_i − 1 edges. Add them up."],
      solutions: [{ approach: "Sum over the trees", text: `The components are trees T_1, …, T_${c} with n_1 + … + n_${c} = ${n} vertices. T_i has n_i − 1 edges, so the total is Σ (n_i − 1) = ${n} − ${c} = ${n - c}.` }],
      tags: ["forest", "trees"],
    };
  }
  const m = int(r, 3, n - 2);
  return {
    topic: "graphs", kind: "short", difficulty: 1,
    title: "How few components?",
    prompt: `A simple graph has ${n} vertices and ${m} edges. What is the least number of connected components it can have? What is the most?`,
    hints: ["Every graph has at least n − m components (adding an edge merges at most two components).", "For the most, cram all the edges into as few vertices as possible."],
    solutions: [{ approach: "Components bound plus a construction", text: (() => {
      let k = 1; while ((k * (k - 1)) / 2 < m) k++;
      const least = Math.max(1, n - m);
      const leastNote = n - m >= 1 ? `At least n − m = ${n - m}, achieved by a forest with ${m} edges (each edge joins two components).` : `n − m ≤ 0, so the bound only gives 1; ${m} ≥ ${n - 1} edges can make the graph connected, e.g. a spanning tree plus extra edges.`;
      return `Least: ${least}. ${leastNote}\nMost: put all ${m} edges inside the smallest clique that can hold them, K_${k} (it has ${(k * (k - 1)) / 2} ≥ ${m} edges), leaving ${n - k} isolated vertices. That gives ${n - k + 1} components, and no arrangement does better, since a component with c_i vertices holds at most c_i(c_i − 1)/2 edges.`;
    })() }],
    tags: ["components", "induction on edges"],
  };
}

function mantelCheck(r) {
  const n = int(r, 6, 20);
  const max = Math.floor((n * n) / 4);
  const m = max + int(r, -3, 3);
  const forced = m > max;
  return {
    topic: "graphs", kind: "short", difficulty: 2,
    title: "Forced to have a triangle?",
    prompt: `A simple graph has ${n} vertices and ${m} edges. Must it contain a triangle? Justify.`,
    hints: ["Mantel: a triangle-free graph on n vertices has at most ⌊n²/4⌋ edges.", "If the count is within the bound, look for a complete bipartite example."],
    solutions: [{ approach: "Mantel's theorem", text: `⌊${n}²/4⌋ = ${max}.\n${forced ? `${m} > ${max}, so by Mantel's theorem the graph must contain a triangle.` : `${m} ≤ ${max}, so it need not: take the complete bipartite graph K_{${Math.floor(n / 2)},${Math.ceil(n / 2)}} (${max} edges, no odd cycles, so no triangles) and delete ${max - m} edge${max - m === 1 ? "" : "s"}.`}` }],
    tags: ["Mantel", "triangle-free"],
  };
}

// ---------- matchings ----------
function hallCheck(r) {
  const k = int(r, 4, 5);
  const X = Array.from({ length: k }, (_, i) => `x${i + 1}`);
  const Y = Array.from({ length: k }, (_, i) => `y${i + 1}`);
  const adj = X.map(() => { const s = new Set(); const d = int(r, 1, 3); while (s.size < d) s.add(int(r, 0, k - 1)); return [...s].sort(); });
  // max matching by augmenting paths
  const matchY = Array(k).fill(-1);
  const tryX = (x, seen) => {
    for (const y of adj[x]) {
      if (seen[y]) continue; seen[y] = true;
      if (matchY[y] < 0 || tryX(matchY[y], seen)) { matchY[y] = x; return true; }
    }
    return false;
  };
  let size = 0;
  for (let x = 0; x < k; x++) if (tryX(x, Array(k).fill(false))) size++;
  let violator = null;
  if (size < k) {
    for (let mask = 1; mask < 1 << k && !violator; mask++) {
      const S = X.map((_, i) => i).filter((i) => mask & (1 << i));
      const N = new Set(S.flatMap((i) => adj[i]));
      if (N.size < S.length) violator = { S, N: [...N].sort() };
    }
  }
  const lab = (arr, P) => `{${arr.map((i) => `${P}_${i + 1}`).join(", ")}}`;
  const matching = matchY.map((x, y) => (x >= 0 ? `x_${x + 1}y_${y + 1}` : null)).filter(Boolean);
  return {
    topic: "matchings", kind: "short", difficulty: 2,
    title: "Can everyone be matched?",
    prompt: `In a bipartite graph with X = {${X.map((_, i) => `x_${i + 1}`).join(", ")}} and Y = {${Y.map((_, i) => `y_${i + 1}`).join(", ")}}, the neighbourhoods are\n${X.map((_, i) => `N(x_${i + 1}) = ${lab(adj[i], "y")}`).join("\n")}\nIs there a matching that saturates X? If yes, give one. If no, give a set S ⊆ X that violates Hall's condition.`,
    hints: ["Try to build a matching greedily, then repair it with augmenting paths.", "If you get stuck, look for a group of x's whose combined neighbourhood is too small."],
    solutions: [{ approach: size === k ? "Exhibit the matching" : "Hall violator", text: size === k
      ? `Yes. One matching saturating X: ${matching.join(", ")}. Each x_i is used once and each y_j at most once, and every pair listed is an edge.`
      : `No. Take S = ${lab(violator.S, "x")}. Then N(S) = ${lab(violator.N, "y")}, so |N(S)| = ${violator.N.length} < ${violator.S.length} = |S|. By Hall's theorem no matching saturates X. (A maximum matching has size ${size}, e.g. ${matching.join(", ")}.)` }],
    tags: ["Hall", "matching"],
  };
}

// ---------- induction & pigeonhole ----------
function pigeonhole(r) {
  const v = choice(r, [
    () => { const k = int(r, 2, 6); return { prompt: `How many people must be in a room to guarantee that at least ${k} share a birth month?`, ans: (k - 1) * 12 + 1, text: `With ${(k - 1) * 12} people, put exactly ${k - 1} in each month: no month has ${k}. With ${(k - 1) * 12 + 1}, generalized pigeonhole gives some month at least ⌈${(k - 1) * 12 + 1}/12⌉ = ${k}. Answer: ${(k - 1) * 12 + 1}.` }; },
    () => { const c = int(r, 3, 6), k = int(r, 2, 5); return { prompt: `A drawer has socks in ${c} colours, many of each. How many socks must you take, in the dark, to be sure of getting ${k} of the same colour?`, ans: c * (k - 1) + 1, text: `${c * (k - 1)} socks could be ${k - 1} of each colour. One more forces a colour to reach ${k}, by pigeonhole (⌈${c * (k - 1) + 1}/${c}⌉ = ${k}). Answer: ${c * (k - 1) + 1}.` }; },
    () => { const d = int(r, 3, 9); return { prompt: `What is the smallest n such that among any n integers, two of them have a difference divisible by ${d}?`, ans: d + 1, text: `Boxes are remainders mod ${d}: there are ${d}. The integers 0, 1, …, ${d - 1} have distinct remainders, so ${d} is not enough. With ${d + 1}, two share a remainder and their difference is divisible by ${d}. Answer: ${d + 1}.` }; },
    () => { const n = int(r, 3, 8); return { prompt: `Pick integers from {1, 2, …, ${2 * n}}. What is the fewest you must pick to guarantee two that differ by exactly 1?`, ans: n + 1, text: `Pair them as {1,2}, {3,4}, …, {${2 * n - 1},${2 * n}}: ${n} boxes. Picking ${n + 1} puts two in the same pair, and those differ by 1. The ${n} odd numbers show ${n} is not enough. Answer: ${n + 1}.` }; },
  ])();
  return {
    topic: "induction", kind: "short", difficulty: 1,
    title: "Pigeonhole: how many guarantee it?",
    prompt: v.prompt,
    hints: ["Decide what the boxes are.", "Show the number is tight: give an arrangement one smaller that avoids the outcome."],
    solutions: [{ approach: "Generalized pigeonhole", text: v.text }],
    tags: ["pigeonhole"],
  };
}

function inductionSum(r) {
  const v = [
    { lhs: "1 + 3 + 5 + … + (2n − 1)", rhs: "n^2", f: (n) => n * n, step: "n^2 + (2n + 1) = (n + 1)^2" },
    { lhs: "1·2 + 2·3 + … + n(n + 1)", rhs: "n(n + 1)(n + 2)/3", f: (n) => (n * (n + 1) * (n + 2)) / 3, step: "n(n+1)(n+2)/3 + (n+1)(n+2) = (n+1)(n+2)(n+3)/3" },
    { lhs: "1/(1·2) + 1/(2·3) + … + 1/(n(n + 1))", rhs: "n/(n + 1)", f: null, step: "n/(n+1) + 1/((n+1)(n+2)) = (n(n+2) + 1)/((n+1)(n+2)) = (n+1)/(n+2)" },
    { lhs: "1 + 2 + 4 + … + 2^{n−1}", rhs: "2^n − 1", f: (n) => 2 ** n - 1, step: "(2^n − 1) + 2^n = 2^{n+1} − 1" },
    { lhs: "1^3 + 2^3 + … + n^3", rhs: "(n(n + 1)/2)^2", f: (n) => ((n * (n + 1)) / 2) ** 2, step: "(n(n+1)/2)^2 + (n+1)^3 = (n+1)^2(n^2 + 4n + 4)/4 = ((n+1)(n+2)/2)^2" },
  ][int(r, 0, 4)];
  return {
    topic: "induction", kind: "proof", difficulty: 1,
    title: "A sum by induction",
    prompt: `Prove by induction that for every integer n ≥ 1,\n${v.lhs} = ${v.rhs}.`,
    hints: ["Base case n = 1: check both sides.", "In the step, add the (n + 1)-th term to the formula for n and simplify to the formula for n + 1."],
    solutions: [{ approach: "Weak induction", text: `Let P(n) be the claim.\nBase case: for n = 1 both sides agree.\nInductive step: assume P(n). Adding the next term to both sides,\n${v.step},\nwhich is P(n + 1). By induction P(n) holds for all n ≥ 1.` }],
    tags: ["induction"],
  };
}

export const GENERATORS = {
  bayes: bayesTest,
  urns: twoUrns,
  incexc: inclusionExclusion,
  dicecond: diceConditional,
  indep: independenceCheck,
  repeat: distinctBirthdays,
  bins: emptyBins,
  pattern: patternCount,
  geom: geometricDie,
  cheb: binomialChebyshev,
  markov: markovShift,
  coupon: couponPartial,
  maxdice: maxOfDice,
  degseq: degreeSequence,
  treedeg: treeDegrees,
  euler: eulerCheck,
  comps: componentsForest,
  mantel: mantelCheck,
  hall: hallCheck,
  pigeon: pigeonhole,
  indsum: inductionSum,
};

// Build a problem from a template name and seed.
export function generate(name, seed) {
  const q = GENERATORS[name](rng(seed));
  return { ...q, id: `GEN-${name}-${seed}`, generated: true };
}

// Template names grouped by topic (computed once from a sample).
export const GEN_BY_TOPIC = Object.keys(GENERATORS).reduce((acc, name) => {
  const t = generate(name, 1).topic;
  (acc[t] = acc[t] || []).push(name);
  return acc;
}, {});

export function randomGenerated(topic, kinds) {
  const pool = (topic && topic !== "all" ? GEN_BY_TOPIC[topic] || [] : Object.keys(GENERATORS)).filter(
    (name) => !kinds || kinds.includes(generate(name, 1).kind)
  );
  if (!pool.length) return null;
  const name = pool[Math.floor(Math.random() * pool.length)];
  return generate(name, 1 + Math.floor(Math.random() * 1e6));
}
