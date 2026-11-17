"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { QUESTIONS } from "../lib/questions";
import { TOPICS, DIFFICULTY } from "../lib/topics";
import { KEYS, useStored } from "../lib/storage";
import MathText from "./MathText";

// Problems in a topic, easiest first, keeping file order within a level.
const byTopic = Object.fromEntries(
  TOPICS.map((t) => [
    t.slug,
    QUESTIONS.filter((q) => q.topic === t.slug).sort(
      (a, b) => a.difficulty - b.difficulty || QUESTIONS.indexOf(a) - QUESTIONS.indexOf(b)
    ),
  ])
);

function Current({ q, onGotIt, onReview, status }) {
  const [hints, setHints] = useState(0);
  const [showSol, setShowSol] = useState(false);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const onKey = (e) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName) || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "h") setHints((n) => Math.min(q.hints.length, n + 1));
      else if (k === "s") setShowSol(true);
      else if (k === "enter" && e.target.tagName !== "BUTTON") onGotIt();
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [q, onGotIt]);

  return (
    <article className="path-card">
      <div className="path-card-meta">
        <span className={`mark ${status || ""}`}>{q.id}</span>
        <span className="chip">{DIFFICULTY[q.difficulty]}</span>
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
          {q.solutions.length > 1 && (
            <div className="tabs" role="tablist" aria-label="Solutions">
              {q.solutions.map((s, i) => (
                <button key={i} role="tab" aria-selected={tab === i} onClick={() => setTab(i)}>{s.approach}</button>
              ))}
            </div>
          )}
          {q.solutions.length === 1 && <div className="muted" style={{ fontSize: "0.9rem", marginBottom: 8 }}>{q.solutions[0].approach}</div>}
          <div className="solution" key={tab}><MathText>{q.solutions[tab].text}</MathText></div>
        </div>
      )}

      <div className="path-actions">
        <button className="pill-btn" onClick={() => setHints((n) => n + 1)} disabled={hints >= q.hints.length}>
          {hints === 0 ? "Hint" : hints < q.hints.length ? "Another hint" : "No more hints"}
        </button>
        {!showSol && <button className="pill-btn" onClick={() => setShowSol(true)}>Show solution</button>}
        <span style={{ flex: 1 }} />
        <button className="pill-btn quiet" onClick={onReview}>{status === "review" ? "Marked to review" : "Review later"}</button>
        <button className="pill-btn dark" onClick={onGotIt}>Got it, next</button>
      </div>
    </article>
  );
}

export default function StudyPath() {
  const [progress, setProgress, loaded] = useStored(KEYS.progress, {});
  const [topic, setTopic] = useState(null);
  const [currentId, setCurrentId] = useState(null);

  const doneIn = (slug) => byTopic[slug].filter((q) => progress[q.id] === "solved").length;

  // Start on the first topic that still has unsolved problems.
  useEffect(() => {
    if (!loaded || topic) return;
    const first = TOPICS.find((t) => doneIn(t.slug) < byTopic[t.slug].length) || TOPICS[0];
    setTopic(first.slug);
  }, [loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const list = topic ? byTopic[topic] : [];
  const open = list.filter((q) => progress[q.id] !== "solved");
  const current = useMemo(
    () => (currentId && list.find((q) => q.id === currentId && progress[q.id] !== "solved")) || open[0] || null,
    [currentId, list, open, progress]
  );
  const upNext = open.filter((q) => q.id !== current?.id).slice(0, 4);
  const t = TOPICS.find((x) => x.slug === topic);

  const mark = (id, s) => setProgress((p) => ({ ...p, [id]: s }));
  const gotIt = () => {
    if (!current) return;
    mark(current.id, "solved");
    setCurrentId(upNext[0]?.id || null);
  };
  const review = () => {
    if (!current) return;
    if (progress[current.id] === "review") {
      setProgress((p) => { const n = { ...p }; delete n[current.id]; return n; });
    } else {
      mark(current.id, "review");
      if (upNext[0]) setCurrentId(upNext[0].id);
    }
  };
  const pickTopic = (slug) => { setTopic(slug); setCurrentId(null); };
  const nextTopic = TOPICS.find((x) => x.slug !== topic && doneIn(x.slug) < byTopic[x.slug].length);

  if (!loaded || !topic) return <div className="path" style={{ minHeight: 600 }} />;

  return (
    <div className="path">
      <aside className="path-side" aria-label="Topics">
        <h2>Everything on the exam</h2>
        {TOPICS.map((x) => {
          const done = doneIn(x.slug);
          const total = byTopic[x.slug].length;
          return (
            <button key={x.slug} className="path-topic" aria-current={x.slug === topic} onClick={() => pickTopic(x.slug)}>
              <span className="row">
                <span>{x.name}</span>
                <span className="count">{done === total ? "Done" : `${done} / ${total}`}</span>
              </span>
              <span className="bar"><i style={{ width: `${(done / total) * 100}%` }} /></span>
            </button>
          );
        })}
        <div className="path-side-links">
          <Link href={`/quick`}>More practice in the quick exam</Link>
          <Link href="/proof">Sketch a proof</Link>
          <Link href="/mock">Take a timed mock</Link>
          <Link href={`/practice?topic=${topic}`}>Browse every {t.short.toLowerCase()} problem</Link>
        </div>
      </aside>

      <section className="path-main">
        <h1>{t.name}</h1>
        <p className="path-sub">
          {list.length} problems, easiest first. {open.length === 0 ? "All done." : `${list.length - open.length} done.`}
        </p>

        {current ? (
          <Current key={current.id} q={current} status={progress[current.id]} onGotIt={gotIt} onReview={review} />
        ) : (
          <article className="path-card">
            <h2>You've done every {t.short.toLowerCase()} problem.</h2>
            <p className="muted" style={{ marginTop: 8 }}>
              {nextTopic ? `${nextTopic.name} still has ${byTopic[nextTopic.slug].length - doneIn(nextTopic.slug)} open.` : "That's the whole bank. Try a timed mock next."}
            </p>
            <div className="path-actions">
              <Link className="pill-btn" href="/quick">More {t.short.toLowerCase()} problems</Link>
              {nextTopic ? (
                <button className="pill-btn dark" onClick={() => pickTopic(nextTopic.slug)}>Go to {nextTopic.short.toLowerCase()}</button>
              ) : (
                <Link className="pill-btn dark" href="/mock">Start a mock</Link>
              )}
            </div>
          </article>
        )}

        {upNext.length > 0 && (
          <>
            <h3 className="path-next-head">Up next</h3>
            <ul className="path-next">
              {upNext.map((q) => (
                <li key={q.id}>
                  <button onClick={() => setCurrentId(q.id)}>
                    <span className={`id mark ${progress[q.id] || ""}`}>{q.id}</span>
                    <span className="title">{q.title}</span>
                    <span className="level">{DIFFICULTY[q.difficulty]}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
