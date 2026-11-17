"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { QUESTIONS } from "../lib/questions";
import { HIDDEN } from "../lib/pool";
import { randomGenerated } from "../lib/generators";
import { TOPIC_BY_SLUG, KIND } from "../lib/topics";
import { KEYS, useStored } from "../lib/storage";
import MathText from "./MathText";

// Blueprint for an 8-problem mock, loosely modelled on the practice exam mix.
const BLUEPRINT = [
  { topics: ["probability"], difficulty: [1, 2], label: "A probability warm-up" },
  { topics: ["probability", "expectation"], kinds: ["short", "compute"], label: "A short probability or expectation computation" },
  { topics: ["graphs"], kinds: ["proof"], difficulty: [2, 3], label: "A graph proof" },
  { topics: ["expectation", "probability"], kinds: ["compute", "proof"], difficulty: [2], label: "An expectation problem at exam level" },
  { topics: ["graphs"], kinds: ["proof"], difficulty: [2, 3], label: "A second graph proof" },
  { topics: ["matchings", "induction"], kinds: ["proof", "compute"], label: "A matching or induction problem" },
  { topics: ["trees"], kinds: ["proof"], difficulty: [2], label: "A tree proof" },
  { topics: ["graphs", "trees"], kinds: ["proof", "short"], label: "One more on graphs or trees" },
];

const TOTAL_SECONDS = 90 * 60;

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Mocks draw from the hidden bank first, mix in generated variants for
// computational slots, and fall back to the visible bank only if needed.
function buildMock() {
  const used = new Set();
  return BLUEPRINT.map((slot) => {
    const fits = (q) =>
      !used.has(q.id) &&
      slot.topics.includes(q.topic) &&
      (!slot.kinds || slot.kinds.includes(q.kind)) &&
      (!slot.difficulty || slot.difficulty.includes(q.difficulty));
    const hidden = HIDDEN.filter(fits);
    const computational = !slot.kinds || slot.kinds.some((k) => k === "compute" || k === "short");
    if (computational && (Math.random() < 0.3 || !hidden.length)) {
      const g = randomGenerated(pick(slot.topics), slot.kinds);
      if (g && !used.has(g.id)) { used.add(g.id); return g; }
    }
    if (hidden.length) { const q = pick(hidden); used.add(q.id); return q; }
    const pool = QUESTIONS.filter(
      (q) =>
        !used.has(q.id) &&
        slot.topics.includes(q.topic) &&
        (!slot.kinds || slot.kinds.includes(q.kind)) &&
        (!slot.difficulty || slot.difficulty.includes(q.difficulty))
    );
    const choices = pool.length ? pool : QUESTIONS.filter((q) => !used.has(q.id) && slot.topics.includes(q.topic));
    const q = pick(choices.length ? choices : QUESTIONS.filter((x) => !used.has(x.id)));
    used.add(q.id);
    return q;
  });
}

function fmt(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Mock() {
  const [phase, setPhase] = useState("ready"); // ready | running | review
  const [questions, setQuestions] = useState([]);
  const [left, setLeft] = useState(TOTAL_SECONDS);
  const [grades, setGrades] = useState({});
  const [open, setOpen] = useState({});
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useStored(KEYS.mock, []);
  const timer = useRef(null);

  const finish = () => {
    clearInterval(timer.current);
    setPhase("review");
    setOpen(Object.fromEntries(questions.map((q) => [q.id, true])));
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    if (phase !== "running") return;
    timer.current = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(timer.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer.current);
  }, [phase]);

  useEffect(() => {
    if (phase === "running" && left === 0) finish();
  }, [left, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Warn before leaving a mock in progress.
  useEffect(() => {
    if (phase !== "running") return;
    const warn = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [phase]);

  const start = () => {
    setQuestions(buildMock());
    setGrades({});
    setOpen({});
    setSaved(false);
    setLeft(TOTAL_SECONDS);
    setPhase("running");
    window.scrollTo({ top: 0 });
  };

  const grade = (id, g) => {
    setSaved(false);
    setGrades((prev) => ({ ...prev, [id]: prev[id] === g ? undefined : g }));
  };

  const breakdown = useMemo(() => {
    const byTopic = {};
    questions.forEach((q) => {
      byTopic[q.topic] = byTopic[q.topic] || { got: 0, total: 0 };
      byTopic[q.topic].total += 1;
      if (grades[q.id] === "got") byTopic[q.topic].got += 1;
    });
    return byTopic;
  }, [questions, grades]);

  const score = questions.reduce((n, q) => n + (grades[q.id] === "got" ? 1 : 0), 0);
  const graded = questions.filter((q) => grades[q.id]).length;

  const saveRun = () => {
    const run = { at: new Date().toISOString(), score, total: questions.length, byTopic: breakdown, used: TOTAL_SECONDS - left };
    setHistory([run, ...history].slice(0, 10));
    setSaved(true);
  };

  if (phase === "ready") {
    return (
      <div className="mock-start">
        <div>
          <p className="serif" style={{ fontSize: "1.15rem", maxWidth: "52ch" }}>
            Eight problems on one sheet, drawn at random in this order:
          </p>
          <ol>
            {BLUEPRINT.map((b, i) => <li key={i}>{b.label}</li>)}
          </ol>
          <p className="muted" style={{ maxWidth: "52ch" }}>
            Closed book. Write on paper. Solutions stay hidden until you finish or the clock runs out, then you grade
            each answer yourself.
          </p>
          <button className="btn btn-primary" onClick={start} style={{ height: 44, padding: "0 20px", fontSize: "1rem" }}>
            Start the clock
          </button>
        </div>
        <div className="sheet" style={{ padding: "22px 24px" }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: 4 }}>Past runs</h2>
          {history.length === 0 ? (
            <p className="muted" style={{ fontSize: "0.92rem", margin: "6px 0 0" }}>
              Your saved runs will show up here, so you can see your score move across attempts.
            </p>
          ) : (
            <ul className="history">
              {history.map((r, i) => (
                <li key={i}>
                  <span>{new Date(r.at).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}, {new Date(r.at).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</span>
                  <strong className="tnum">{r.score} of {r.total}</strong>
                  <div className="meter bar"><i className="m-solved" style={{ width: `${(r.score / r.total) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  const low = phase === "running" && left < 10 * 60;

  return (
    <>
      <div className="exam-bar">
        <div className="exam-bar-inner">
          <div className={`exam-clock ${low ? "low" : ""}`} role="timer" aria-live="off">
            {fmt(left)}
            <span>{phase === "running" ? "left" : left === 0 ? "time is up" : `used ${fmt(TOTAL_SECONDS - left)}`}</span>
          </div>
          {phase === "running" ? (
            <button className="btn btn-primary" onClick={finish}>Hand in and see solutions</button>
          ) : (
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span className="muted tnum" style={{ fontSize: "0.92rem", marginRight: 6 }}>
                {graded < questions.length ? `${graded} of ${questions.length} graded` : `Score ${score} of ${questions.length}`}
              </span>
              <button className="btn btn-primary" onClick={saveRun} disabled={graded === 0 || saved}>
                {saved ? "Saved" : "Save this run"}
              </button>
              <button className="btn" onClick={start}>New mock</button>
            </div>
          )}
        </div>
        <div className="drain" aria-hidden="true"><i style={{ width: `${(left / TOTAL_SECONDS) * 100}%`, background: low ? "var(--redpen)" : undefined }} /></div>
      </div>

      <div className="exam-paper sheet">
        <header>
          <div>
            <h2>CIS 1600 Midterm 2: practice</h2>
            <div className="muted" style={{ fontSize: "0.92rem" }}>8 problems, 90 minutes. Show your work.</div>
          </div>
          <div className="namefield">Name<i /></div>
        </header>

        {questions.map((q, i) => (
          <section key={q.id} className="exam-q">
            <div className="qn">
              {i + 1}.
              {grades[q.id] === "got" && <span className="grade-mark" aria-label="Got it">✓</span>}
              {grades[q.id] === "missed" && <span className="grade-mark" aria-label="Missed">✗</span>}
            </div>
            <div>
              <h3>{q.title}</h3>
              <div className="qtopic">{TOPIC_BY_SLUG[q.topic]?.name}, {KIND[q.kind].toLowerCase()}</div>
              <div className="prompt" style={{ fontSize: "1.1rem" }}><MathText>{q.prompt}</MathText></div>

              {phase === "review" && (
                <>
                  <div className="actions">
                    <button className="btn btn-sm mark-solved" aria-pressed={grades[q.id] === "got"} onClick={() => grade(q.id, "got")}>I got it</button>
                    <button className="btn btn-sm mark-review" aria-pressed={grades[q.id] === "missed"} onClick={() => grade(q.id, "missed")}>I missed it</button>
                    <button className="btn btn-sm btn-ghost" onClick={() => setOpen((o) => ({ ...o, [q.id]: !o[q.id] }))}>
                      {open[q.id] ? "Hide solution" : "Show solution"}
                    </button>
                  </div>
                  {open[q.id] && (
                    <div className="solution">
                      {q.solutions.map((s, j) => (
                        <div key={j} style={{ marginBottom: j < q.solutions.length - 1 ? 16 : 0 }}>
                          <strong>{q.solutions.length > 1 ? `Route ${j + 1}: ` : ""}{s.approach}</strong>
                          {"\n"}
                          <MathText>{s.text}</MathText>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        ))}
      </div>

      {phase === "review" && graded > 0 && (
        <div className="exam-paper sheet" style={{ padding: "28px 56px" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: 14 }}>By topic</h2>
          <div className="props" style={{ marginTop: 0 }}>
            {Object.entries(breakdown).map(([slug, v]) => (
              <div key={slug} className="prop" style={{ gridTemplateColumns: "1fr auto" }}>
                <div>
                  <b>{TOPIC_BY_SLUG[slug]?.name}</b>
                  <div className="meter" style={{ marginTop: 8 }}><i className="m-solved" style={{ width: `${(v.got / v.total) * 100}%` }} /></div>
                </div>
                <span className="tnum" style={{ color: v.got < v.total ? "var(--redpen)" : "var(--graphite)" }}>{v.got}/{v.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
