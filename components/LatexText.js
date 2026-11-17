"use client";

import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { texifyLine } from "../lib/texify";

// Renders plain-text math as typeset LaTeX via KaTeX. Prose stays prose,
// set in KaTeX's Computer Modern face so the whole proof reads like a LaTeX document.
export default function LatexText({ children, className = "" }) {
  const lines = useMemo(
    () =>
      String(children ?? "")
        .split("\n")
        .map((line) => {
          const segs = texifyLine(line);
          const out = [];
          segs.forEach((seg, i) => {
            if (!seg.tex) {
              out.push({ text: seg.s });
              return;
            }
            const html = katex.renderToString(seg.s, { throwOnError: false, strict: "ignore" });
            // keep punctuation that follows the math on the same line as it
            const next = segs[i + 1];
            const m = next && !next.tex && next.s.match(/^[.,;:!?)\]]+/);
            if (m) {
              next.s = next.s.slice(m[0].length);
              out.push({ html, punct: m[0] });
            } else out.push({ html });
          });
          return out.filter((s) => s.html || s.text);
        }),
    [children]
  );

  return (
    <div className={`latex ${className}`}>
      {lines.map((segs, i) => (
        <p key={i}>
          {segs.length === 0
            ? " "
            : segs.map((s, j) =>
                s.html ? (
                  <span key={j} style={{ whiteSpace: "nowrap" }}>
                    <span dangerouslySetInnerHTML={{ __html: s.html }} />
                    {s.punct}
                  </span>
                ) : (
                  <span key={j}>{s.text}</span>
                )
              )}
        </p>
      ))}
    </div>
  );
}
