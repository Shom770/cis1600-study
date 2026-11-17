// Renders plain-text math with real subscripts and superscripts:
// v_k, v_{i+1}, 2^{2n}, 4^n become <sub>/<sup>. Everything else passes through.
const RE = /([_^])(?:\{([^{}]*)\}|([A-Za-z0-9]+))/g;

export default function MathText({ children }) {
  const text = String(children ?? "");
  const out = [];
  let last = 0;
  let m;
  RE.lastIndex = 0;
  while ((m = RE.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const body = m[2] ?? m[3];
    out.push(m[1] === "_" ? <sub key={m.index}>{body}</sub> : <sup key={m.index}>{body}</sup>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
