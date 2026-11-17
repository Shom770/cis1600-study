// Turns the plain-text math used in the problem files (Pr[A | B], v_{i+1}, n², ≤, ∩ …)
// into TeX, one line at a time. Math runs are detected by token type, translated,
// and returned as segments: { tex: true, s } for math and { tex: false, s } for prose.

const SYM = {
  "≤": "\\le ", "≥": "\\ge ", "≠": "\\ne ", "≈": "\\approx ", "·": "\\cdot ", "×": "\\times ", "−": "-", "–": "-",
  "∩": "\\cap ", "∪": "\\cup ", "⊆": "\\subseteq ", "⊂": "\\subset ", "∈": "\\in ", "∉": "\\notin ", "∅": "\\emptyset ",
  "→": "\\to ", "⇒": "\\Rightarrow ", "⇔": "\\Leftrightarrow ", "⟹": "\\implies ", "↦": "\\mapsto ",
  "Σ": "\\sum ", "∑": "\\sum ", "∏": "\\prod ", "⌈": "\\lceil ", "⌉": "\\rceil ", "⌊": "\\lfloor ", "⌋": "\\rfloor ",
  "√": "\\sqrt ", "∞": "\\infty ", "…": "\\dots ", "⋯": "\\cdots ", "¬": "\\neg ", "∧": "\\land ", "∨": "\\lor ",
  "′": "'", "%": "\\%", "{": "\\{", "}": "\\}", "#": "\\#", "&": "\\&", "~": "\\sim ", "∖": "\\setminus ",
  "Ω": "\\Omega ", "ω": "\\omega ", "α": "\\alpha ", "β": "\\beta ", "γ": "\\gamma ", "δ": "\\delta ", "Δ": "\\Delta ",
  "ε": "\\varepsilon ", "λ": "\\lambda ", "μ": "\\mu ", "σ": "\\sigma ", "χ": "\\chi ", "π": "\\pi ", "θ": "\\theta ",
  "ρ": "\\rho ", "τ": "\\tau ", "φ": "\\varphi ",
  "Ā": "\\bar{A}", "Ē": "\\bar{E}", "Ō": "\\bar{O}", "Ū": "\\bar{U}", "ā": "\\bar{a}", "ē": "\\bar{e}", "ō": "\\bar{o}", "ū": "\\bar{u}",
};
const SUBS = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9", "₊": "+", "₋": "-", "ᵢ": "i", "ⱼ": "j", "ₖ": "k", "ₙ": "n", "ₘ": "m", "ₓ": "x", "ₜ": "t" };
const SUPS = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁺": "+", "⁻": "-", "ⁿ": "n", "ᵏ": "k", "ⁱ": "i" };
const FUNCS = { Pr: "\\Pr", Var: "\\operatorname{Var}", Cov: "\\operatorname{Cov}", deg: "\\deg", gcd: "\\gcd", max: "\\max", min: "\\min", log: "\\log", ln: "\\ln", mod: "\\bmod", lcm: "\\operatorname{lcm}" };

// "strong" symbols: a run containing any of these is definitely math
const STRONG = new Set([..."=<>+*/^_|≤≥≠≈·×−∩∪⊆⊂∈∉∅→⇒⇔⟹Σ∑∏⌈⌉⌊⌋√∞¬∧∨′∖~ΩωαβγδΔελμσχπθρτφĀĒŌŪāēōū", ...Object.keys(SUBS), ...Object.keys(SUPS)]);
const SUBSUP = "(?:[_^](?:\\{[^{}]*\\}|\\d+|[A-Z]{2,3}(?![a-z])|[A-Za-z])|[₀-₉₊₋ᵢⱼₖₙₘₓₜ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿᵏⁱ]+)*";
const TOKEN = new RegExp(
  [
    "(?<abbr>e\\.g\\.|i\\.e\\.|etc\\.|vs\\.)",
    `(?<word>[A-Za-z][A-Za-z]*(?:[-'’][A-Za-z]+)*̄?${SUBSUP})`,
    `(?<num>\\d+(?:\\.\\d+)?${SUBSUP})`,
    "(?<space>[ \\t]+)",
    `(?<sym>[\\s\\S]${SUBSUP})`,
  ].join("|"),
  "gu"
);

function scriptTex(raw) {
  // convert trailing _x / ^{..} / unicode scripts on a token into TeX
  let out = "";
  const re = /([_^])(\{[^{}]*\}|\d+|[A-Z]{2,3}(?![a-z])|[A-Za-z])|([₀-₉₊₋ᵢⱼₖₙₘₓₜ]+)|([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿᵏⁱ]+)/gu;
  let m;
  while ((m = re.exec(raw))) {
    if (m[1]) {
      const body = m[2].startsWith("{") ? m[2].slice(1, -1) : m[2];
      out += `${m[1]}{${inner(body)}}`;
    } else if (m[3]) out += `_{${[...m[3]].map((c) => SUBS[c]).join("")}}`;
    else out += `^{${[...m[4]].map((c) => SUPS[c]).join("")}}`;
  }
  return out;
}
function splitScripts(text) {
  const i = text.search(/[_^₀-₉₊₋ᵢⱼₖₙₘₓₜ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿᵏⁱ]/u);
  return i < 0 ? [text, ""] : [text.slice(0, i), text.slice(i)];
}
// Translate a short math string (used for sub/superscript bodies).
function inner(s) {
  return [...s].map((c) => SYM[c] ?? c).join("").replace(/\s+/g, " ").trim();
}

function classify(tokens) {
  return tokens.map((t, i) => {
    const { kind, text } = t;
    const [base] = splitScripts(text);
    const hasScript = base !== text;
    if (kind === "space") return "space";
    if (kind === "abbr") return "text";
    if (kind === "num") return hasScript ? "strong" : "weak";
    if (kind === "word") {
      const bare = base.replace("̄", "");
      if (hasScript || base.endsWith("̄")) return "strong";
      if (FUNCS[bare]) return "strong";
      if (bare.length === 1) {
        const prev = tokens.slice(0, i).reverse().find((x) => x.kind !== "space");
        const next = tokens.slice(i + 1).find((x) => x.kind !== "space");
        const nextIsWord = next && next.kind === "word" && splitScripts(next.text)[0].length > 1 && !FUNCS[next.text];
        const prevIsSym = prev && prev.kind === "sym" && STRONG.has(prev.text[0]);
        const nextIsSym = next && next.kind === "sym" && STRONG.has(next.text[0]);
        if (bare === "a" && !prevIsSym && !nextIsSym) return "text";
        if ((bare === "A" || bare === "I") && nextIsWord && !prevIsSym) {
          const atStart = !prev || (prev.kind === "sym" && /[.:!?]/.test(prev.text)) || bare === "I";
          if (atStart) return "text";
        }
        return "strong";
      }
      // two-letter edge names (uv, xy) are math
      if (EDGE_NAMES.has(bare)) return "strong";
      // short all-caps tokens like HH, HT, BY behave like symbols
      if (/^[A-Z]{2,3}$/.test(bare) && !["OK", "TA", "TAS"].includes(bare)) return "caps";
      return "text";
    }
    // symbols
    const c = text[0];
    if (STRONG.has(c)) return "strong";
    if ("()[],…'.:;!?".includes(c) || c === "{" || c === "}") return "punct";
    return "text";
  });
}

function toTex(tokens) {
  let out = "";
  tokens.forEach((t, i) => {
    const { kind, text } = t;
    if (kind === "space") { out += " "; return; }
    const [base, scripts] = splitScripts(text);
    let b;
    if (kind === "word") {
      const bar = base.endsWith("̄");
      const bare = base.replace("̄", "");
      if (FUNCS[bare]) b = FUNCS[bare] + " ";
      else if (t.textInMath) b = `\\text{${bare}}`;
      else if (bare.length > 1 && !/^[A-Z]{2,3}$/.test(bare) && !EDGE_NAMES.has(bare)) b = `\\mathrm{${bare}}`;
      else b = bar ? `\\bar{${bare}}` : bare;
    } else if (kind === "sym" && base === "|") {
      const spaced = tokens[i - 1]?.kind === "space" && tokens[i + 1]?.kind === "space";
      b = spaced ? "\\mid " : "|";
    } else if (kind === "sym" && base === "√") {
      b = "\\sqrt{}";
    } else {
      b = SYM[base] ?? base;
    }
    out += b + scriptTex(scripts);
  });
  // √x → \sqrt{x}
  return out.replace(/\\sqrt\{\}\s*([A-Za-z0-9]+|\([^()]*\))/g, (_, x) => `\\sqrt{${x.startsWith("(") ? x.slice(1, -1) : x}}`);
}

const OPEN = { "(": ")", "[": "]", "{": "}" };
const EDGE_NAMES = new Set(["uv", "vu", "uw", "wu", "vw", "wv", "xy", "yx", "xz", "yz", "wx"]);

export function texifyLine(line) {
  const label = line.match(/^\s*\((?:[a-z]|[ivx]+)\)\s+/);
  if (label) {
    const rest = texifyLine(line.slice(label[0].length));
    if (rest[0] && !rest[0].tex) rest[0].s = label[0] + rest[0].s;
    else rest.unshift({ tex: false, s: label[0] });
    return rest;
  }
  line = line.replace(/\.\.\./g, "…");
  const tokens = [];
  for (const m of line.matchAll(TOKEN)) {
    const kind = Object.keys(m.groups).find((k) => m.groups[k] !== undefined);
    tokens.push({ kind, text: m[0] });
  }
  const cls = classify(tokens);

  // A bracket glued to a math token (Pr[…], E[…], N(…), f(…)) keeps its contents in math,
  // with any words set as \text{…}.
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.kind !== "sym" || !OPEN[t.text] || i === 0) continue;
    const prev = tokens[i - 1];
    if (!(prev.kind === "word" || prev.kind === "num") || !["strong", "caps"].includes(cls[i - 1])) continue;
    let depth = 0, j = i;
    for (; j < tokens.length; j++) {
      if (tokens[j].text === t.text) depth++;
      else if (tokens[j].text === OPEN[t.text]) { depth--; if (depth === 0) break; }
      if (j - i > 40) { j = tokens.length; break; }
    }
    if (j >= tokens.length) continue;
    for (let k = i; k <= j; k++) {
      if (cls[k] === "text" && tokens[k].kind === "word") { tokens[k].textInMath = true; cls[k] = "weak"; }
      else if (cls[k] === "text") cls[k] = "weak";
    }
  }

  // A bracket that is unmatched within its math run belongs to the prose around it
  // ("v_k (k ≥ 2 because …)"), so demote it and regroup until stable.
  for (let changed = true; changed; ) {
    changed = false;
    for (let a = 0; a < tokens.length; ) {
      if (cls[a] === "text") { a++; continue; }
      let b = a;
      while (b < tokens.length && cls[b] !== "text") b++;
      const stack = [];
      const bad = [];
      for (let k = a; k < b; k++) {
        const c = tokens[k].text;
        if (tokens[k].kind !== "sym") continue;
        if (OPEN[c]) stack.push(k);
        else if (Object.values(OPEN).includes(c)) {
          const top = stack[stack.length - 1];
          if (top !== undefined && OPEN[tokens[top].text] === c) stack.pop();
          else bad.push(k);
        }
      }
      for (const k of [...bad, ...stack]) { cls[k] = "text"; changed = true; }
      a = b;
    }
  }

  // Group maximal runs of math-capable tokens.
  const segs = [];
  let i = 0;
  while (i < tokens.length) {
    if (cls[i] === "text") {
      let s = "";
      while (i < tokens.length && cls[i] === "text") s += tokens[i++].text;
      segs.push({ tex: false, s });
      continue;
    }
    let j = i;
    while (j < tokens.length && cls[j] !== "text") j++;
    // trim leading/trailing spaces and punctuation that doesn't belong to the math
    let a = i, b = j - 1;
    const trimmable = (k) => cls[k] === "space" || (cls[k] === "punct" && !tokens[k].textInMath);
    while (a <= b && trimmable(a) && !(OPEN[tokens[a].text] && closes(tokens, cls, a, b))) a++;
    while (b >= a && (trimmable(b) && !(Object.values(OPEN).includes(tokens[b].text) && opens(tokens, a, b)))) b--;
    const lead = tokens.slice(i, a).map((t) => t.text).join("");
    const body = tokens.slice(a, b + 1);
    const trail = tokens.slice(b + 1, j).map((t) => t.text).join("");
    const bodyCls = cls.slice(a, b + 1);
    const isMath = body.length > 0 && bodyCls.some((c) => c === "strong") && !(bodyCls.every((c) => c === "caps" || c === "space" || c === "punct"));
    if (lead) segs.push({ tex: false, s: lead });
    if (isMath) segs.push({ tex: true, s: toTex(body).trim() });
    else if (body.length) segs.push({ tex: false, s: body.map((t) => t.text).join("") });
    if (trail) segs.push({ tex: false, s: trail });
    i = j;
  }
  // merge adjacent prose segments
  return segs.reduce((acc, s) => {
    const last = acc[acc.length - 1];
    if (last && !last.tex && !s.tex) last.s += s.s;
    else acc.push({ ...s });
    return acc;
  }, []);
}

// does the opening bracket at a have a matching close within [a, b]?
function closes(tokens, cls, a, b) {
  const close = OPEN[tokens[a].text];
  let d = 0;
  for (let k = a; k <= b; k++) {
    if (tokens[k].text === tokens[a].text) d++;
    else if (tokens[k].text === close && --d === 0) return true;
  }
  return false;
}
// does the closing bracket at b have a matching open within [a, b]?
function opens(tokens, a, b) {
  const close = tokens[b].text;
  const open = Object.keys(OPEN).find((k) => OPEN[k] === close);
  let d = 0;
  for (let k = b; k >= a; k--) {
    if (tokens[k].text === close) d++;
    else if (tokens[k].text === open && --d === 0) return true;
  }
  return false;
}
