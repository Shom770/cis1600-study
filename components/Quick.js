"use client";

import { useEffect, useRef, useState } from "react";
import { TOPICS, TOPIC_BY_SLUG, DIFFICULTY, KIND } from "../lib/topics";
import { KEYS, useStored } from "../lib/storage";
import { HIDDEN, nextProblem, findProblem, TEMPLATE_COUNT } from "../lib/pool";
import MathText from "./MathText";

function Stopwatch({ start }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const s = Math.max(0, Math.floor((now - start) / 1000));
  const over = s > 11 * 60;
  return (
    <span className="tnum" style={{ color: over ? "var(--redpen)" : "var(--graphite-2)" }} title="About 11 minutes per problem on the real exam">
      {Math.floor(s / 60)}:{String(s % 60).padStart(2, "0")}
    </span>
  );
}

export default function Quick() {
  const [topic, setTopic] = useState("all");
  const [log, setLog, loaded] = useStored(KEYS.quick, {}); // id -> "got" | "missed"
  const [q, setQ] = useState(null);
  const [hints, setHints] = useState(0);
  const [showSol, setShowSol] = useState(false);
  const [tab, setTab] = useState(0);
  const [started, setStarted] = useState(Date.now());
  const [session, setSession] = useState({ got: 0, missed: 0, n: 0 });
  const recent = useRef([]);

  const deal = (t = topic) => {
    const seen = new Set(Object.keys(log));
    const p = nextProblem({ topic: t, seen, exclude: new Set(recent.current) });
    recent.current = [p.id, ...recent.current].slice(0, 20);
    setQ(p);
    setHints(0);
    setShowSol(false);
    setTab(0);
    setStarted(Date.now());
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    if (loaded && !q) deal();
  }, [loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const grade = (g) => {
    if (!q) return;
    setLog((l) => ({ ...l, [q.id]: g }));
    setSession((s) => ({ ...s, n: s.n + 1, [g]: s[g] + 1 }));
    deal();
  };

  useEffect(() => {
    const onKey = (e) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName) || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "h" && q) setHints((n) => Math.min(q.hints.length, n + 1));
      else if (k === "s") setShowSol(true);
      else if (k === "1" && showSol) grade("missed");
      else if (k === "2" && showSol) grade("got");
      else if (k === "n") deal();
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const hiddenFor = HIDDEN.filter((x) => topic === "all" || x.topic === topic);
  const seenHidden = hiddenFor.filter((x) => log[x.id]).length;
  const missedIds = Object.entries(log).filter(([, g]) => g === "missed").map(([id]) => id);

  return (
    <div className="path">
      <aside className="path-side" aria-label="Quick exam settings">
        <h2>Topic</h2>
        {[{ slug: "all", name: "Everything" }, ...TOPICS].map((t) => (
          <button key={t.slug} className="path-topic" aria-current={topic === t.slug} onClick={() => { setTopic(t.slug); deal(t.slug); }}>
            <span className="row"><span>{t.name}</span></span>
          </button>
        ))}
        <div className="path-side-links" style={{ color: "var(--graphite-2)", fontSize: "0.88rem", gap: 10 }}>
          <span><b className="tnum" style={{ color: "var(--graphite)" }}>{seenHidden}</b> of {hiddenFor.length} written problems seen. {TEMPLATE_COUNT} generators make fresh variants forever.</span>
          {missedIds.length > 0 && (
            <button className="pill-btn quiet" style={{ height: 32, padding: 0, justifyContent: "flex-start" }} onClick={() => {
              const id = missedIds[Math.floor(Math.random() * missedIds.length)];
              const p = findProblem(id);
              if (p) { setQ(p); setHints(0); setShowSol(false); setTab(0); setStarted(Date.now()); }
            }}>
              Retry one you missed ({missedIds.length})
            </button>
          )}
        </div>
      </aside>

      <section className="path-main">
        <h1>Quick exam</h1>
        <p className="path-sub">
          One problem at a time, drawn from problems you haven't seen.
          {session.n > 0 && <> This sitting: <b className="tnum" style={{ color: "var(--graphite)" }}>{session.got}</b> got, <b className="tnum" style={{ color: session.missed ? "var(--redpen)" : "var(--graphite)" }}>{session.missed}</b> missed.</>}
        </p>

        {q && (
          <article className="path-card" key={q.id}>
            <div className="path-card-meta">
              <span>{q.generated ? "Generated" : q.id}</span>
              <span className="chip">{TOPIC_BY_SLUG[q.topic]?.short}</span>
              <span className="chip">{DIFFICULTY[q.difficulty]}</span>
              <span className="chip">{KIND[q.kind]}</span>
              {log[q.id] === "missed" && <span className="chip" style={{ background: "var(--redpen-wash)", color: "var(--redpen)" }}>Missed before</span>}
              <span style={{ marginLeft: "auto", fontWeight: 500 }}><Stopwatch start={started} /></span>
            </div>
            <h2>{q.title}</h2>
            <div className="prompt"><MathText>{q.prompt}</MathText></div>

            {hints > 0 && (
              <ol className="hints" style={{ marginTop: 20 }}>
                {q.hints.slice(0, hints).map((h, i) => <li key={i}><MathText>{h}</MathText></li>)}
              </ol>
            )}

            {showSol && (
              <div className="path-solution">
                {q.solutions.length > 1 ? (
                  <div className="tabs" role="tablist" aria-label="Solutions">
                    {q.solutions.map((s, i) => <button key={i} role="tab" aria-selected={tab === i} onClick={() => setTab(i)}>{s.approach}</button>)}
                  </div>
                ) : (
                  <div className="muted" style={{ fontSize: "0.9rem", marginBottom: 8 }}>{q.solutions[0].approach}</div>
                )}
                <div className="solution" key={tab}><MathText>{q.solutions[tab].text}</MathText></div>
              </div>
            )}

            <div className="path-actions">
              {!showSol ? (
                <>
                  <button className="pill-btn" onClick={() => setHints((n) => n + 1)} disabled={hints >= q.hints.length}>
                    {hints === 0 ? "Hint" : hints < q.hints.length ? "Another hint" : "No more hints"} <kbd>H</kbd>
                  </button>
                  <span style={{ flex: 1 }} />
                  <button className="pill-btn quiet" onClick={() => deal()}>Skip <kbd>N</kbd></button>
                  <button className="pill-btn dark" onClick={() => setShowSol(true)}>Check my answer <kbd style={{ color: "#fff", background: "transparent", borderColor: "rgba(255,255,255,.4)" }}>S</kbd></button>
                </>
              ) : (
                <>
                  <span className="muted" style={{ fontSize: "0.92rem" }}>Be honest. Missed problems come back later.</span>
                  <span style={{ flex: 1 }} />
                  <button className="pill-btn" style={{ background: "var(--redpen-wash)", color: "var(--redpen)" }} onClick={() => grade("missed")}>Missed it <kbd>1</kbd></button>
                  <button className="pill-btn dark" onClick={() => grade("got")}>Got it, next <kbd style={{ color: "#fff", background: "transparent", borderColor: "rgba(255,255,255,.4)" }}>2</kbd></button>
                </>
              )}
            </div>
          </article>
        )}
      </section>
    </div>
  );
}
