"use client";

import { useEffect, useRef, useState } from "react";
import { TOPICS, TOPIC_BY_SLUG, DIFFICULTY } from "../lib/topics";
import { KEYS, useStored } from "../lib/storage";
import { ALL_WRITTEN } from "../lib/pool";
import MathText from "./MathText";
import LatexText from "./LatexText";

const PROOFS = ALL_WRITTEN.filter((q) => q.kind === "proof");
const VERDICT = {
  on_track: { label: "On track", color: "var(--ballpoint)" },
  partial: { label: "Partly there", color: "#9a8a00" },
  off_track: { label: "Off track", color: "var(--redpen)" },
};

export default function QuickProof() {
  const [topic, setTopic] = useState("all");
  const [log, setLog, loaded] = useStored(KEYS.proof, {}); // id -> best closeness
  const [q, setQ] = useState(null);
  const [attempt, setAttempt] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showRef, setShowRef] = useState(false);
  const [tab, setTab] = useState(0);
  const box = useRef(null);

  const pool = PROOFS.filter((p) => topic === "all" || p.topic === topic);

  const deal = (t = topic) => {
    const list = PROOFS.filter((p) => t === "all" || p.topic === t);
    const fresh = list.filter((p) => log[p.id] === undefined && p.id !== q?.id);
    const weak = list.filter((p) => (log[p.id] ?? 100) < 75 && p.id !== q?.id);
    const from = fresh.length ? fresh : weak.length ? weak : list;
    setQ(from[Math.floor(Math.random() * from.length)]);
    setAttempt("");
    setResult(null);
    setError("");
    setShowRef(false);
    setTab(0);
    setTimeout(() => box.current?.focus(), 0);
  };

  useEffect(() => {
    if (loaded && !q) deal();
  }, [loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const check = async () => {
    if (!q || busy || attempt.trim().length < 10) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/proof-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: q.id, attempt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setResult(data);
      setLog((l) => ({ ...l, [q.id]: Math.max(l[q.id] ?? 0, data.closeness) }));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const tried = pool.filter((p) => log[p.id] !== undefined).length;
  const v = result && VERDICT[result.verdict];

  return (
    <div className="path">
      <aside className="path-side" aria-label="Quick proof settings">
        <h2>Topic</h2>
        {[{ slug: "all", name: "Everything" }, ...TOPICS].map((t) => {
          const n = PROOFS.filter((p) => t.slug === "all" || p.topic === t.slug).length;
          if (!n) return null;
          return (
            <button key={t.slug} className="path-topic" aria-current={topic === t.slug} onClick={() => { setTopic(t.slug); deal(t.slug); }}>
              <span className="row"><span>{t.name}</span><span className="count">{n}</span></span>
            </button>
          );
        })}
        <div className="path-side-links" style={{ color: "var(--graphite-2)", fontSize: "0.88rem" }}>
          <span><b className="tnum" style={{ color: "var(--graphite)" }}>{tried}</b> of {pool.length} proofs tried. Ones you haven't nailed come back.</span>
        </div>
      </aside>

      <section className="path-main">
        <h1>Quick proof</h1>
        <p className="path-sub">Sketch the idea in a few sentences, not the full proof. Gemini says whether it would work.</p>

        {q && (
          <article className="path-card" key={q.id}>
            <div className="path-card-meta">
              <span>{q.id}</span>
              <span className="chip">{TOPIC_BY_SLUG[q.topic]?.short}</span>
              <span className="chip">{DIFFICULTY[q.difficulty]}</span>
              {log[q.id] !== undefined && <span className="chip">Best so far {log[q.id]}</span>}
            </div>
            <h2>{q.title}</h2>
            <div className="prompt"><MathText>{q.prompt}</MathText></div>

            <label htmlFor="sketch" className="sketch-label">Your line of reasoning</label>
            <textarea
              id="sketch"
              ref={box}
              className="sketch"
              rows={5}
              value={attempt}
              onChange={(e) => setAttempt(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); check(); } }}
              placeholder="e.g. Take a longest path. Its endpoint has all its neighbours on the path, so…"
            />

            {error && <p className="sketch-error" role="alert">{error}</p>}

            {result && (
              <div className="feedback" aria-live="polite">
                <div className="feedback-head">
                  <span style={{ color: v.color, fontWeight: 700 }}>{v.label}</span>
                  <span className="closeness"><i style={{ width: `${result.closeness}%`, background: v.color }} /></span>
                  <span className="tnum muted">{result.closeness}/100</span>
                </div>
                {result.right && <p><b>What works.</b> {result.right}</p>}
                {result.missing && <p><b>What's missing.</b> {result.missing}</p>}
                {result.nudge && <p><b>Next step.</b> {result.nudge}</p>}
              </div>
            )}

            {showRef && (
              <div className="path-solution">
                {q.solutions.length > 1 ? (
                  <div className="tabs" role="tablist" aria-label="Reference proofs">
                    {q.solutions.map((s, i) => <button key={i} role="tab" aria-selected={tab === i} onClick={() => setTab(i)}>{s.approach}</button>)}
                  </div>
                ) : (
                  <div className="muted" style={{ fontSize: "0.9rem", marginBottom: 8 }}>{q.solutions[0].approach}</div>
                )}
                <LatexText key={tab}>{q.solutions[tab].text}</LatexText>
              </div>
            )}

            <div className="path-actions">
              <button className="pill-btn dark" onClick={check} disabled={busy || attempt.trim().length < 10}>
                {busy ? "Checking…" : result ? "Check again" : "Check my idea"}
              </button>
              <span className="muted" style={{ fontSize: "0.85rem" }}>⌘ Enter</span>
              <span style={{ flex: 1 }} />
              {!showRef && <button className="pill-btn quiet" onClick={() => setShowRef(true)}>Show the proof</button>}
              <button className="pill-btn" onClick={() => deal()}>Next proof</button>
            </div>
          </article>
        )}
      </section>
    </div>
  );
}
