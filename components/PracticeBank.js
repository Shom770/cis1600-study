"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { QUESTIONS } from "../lib/questions";
import { TOPICS, TOPIC_BY_SLUG, DIFFICULTY, KIND } from "../lib/topics";
import { KEYS, useStored } from "../lib/storage";
import MathText from "./MathText";

function Dots({ n }) {
  return (
    <span className="dots" aria-label={DIFFICULTY[n]} title={DIFFICULTY[n]}>
      {[1, 2, 3].map((i) => <i key={i} className={i <= n ? "on" : ""} />)}
    </span>
  );
}

function Problem({ q, status, onStatus, onPrev, onNext, hasPrev, hasNext, position }) {
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolutions, setShowSolutions] = useState(false);
  const [tab, setTab] = useState(0);
  const topic = TOPIC_BY_SLUG[q.topic];

  // keyboard shortcuts for this problem
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "h") setHintsShown((n) => Math.min(q.hints.length, n + 1));
      else if (k === "s") setShowSolutions(true);
      else if (k === "d") onStatus(q.id, status === "solved" ? null : "solved");
      else if (k === "r") onStatus(q.id, status === "review" ? null : "review");
      else if (k === "j" || e.key === "ArrowRight") hasNext && onNext();
      else if (k === "k" || e.key === "ArrowLeft") hasPrev && onPrev();
      else if (showSolutions && /^[1-9]$/.test(k) && +k <= q.solutions.length) setTab(+k - 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [q, status, onStatus, onNext, onPrev, hasNext, hasPrev, showSolutions]);

  return (
    <article className="problem sheet" aria-labelledby="ptitle">
      <div className="problem-meta">
        <span className={`pid mark ${status || ""}`}>{q.id}</span>
        <span>{topic?.name}</span>
        <span>{KIND[q.kind]}</span>
        <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><Dots n={q.difficulty} /> {DIFFICULTY[q.difficulty]}</span>
        <span style={{ marginLeft: "auto" }} className="tnum">{position}</span>
      </div>
      <h2 id="ptitle">{q.title}</h2>
      <div className="prompt"><MathText>{q.prompt}</MathText></div>

      <section className="block">
        <div className="block-head">
          <h3>Hints {hintsShown > 0 && <span className="tnum">({hintsShown} of {q.hints.length})</span>}</h3>
          {hintsShown < q.hints.length && (
            <button className="btn btn-sm" onClick={() => setHintsShown((n) => n + 1)}>
              {hintsShown === 0 ? "Show first hint" : "Show next hint"} <kbd>H</kbd>
            </button>
          )}
        </div>
        {hintsShown > 0 ? (
          <ol className="hints">
            {q.hints.slice(0, hintsShown).map((h, i) => <li key={i}><MathText>{h}</MathText></li>)}
          </ol>
        ) : (
          <p className="muted" style={{ margin: 0, fontSize: "0.92rem" }}>
            {q.hints.length} hint{q.hints.length === 1 ? "" : "s"}, each one gives away a little more.
          </p>
        )}
      </section>

      <section className="block">
        {!showSolutions ? (
          <button className="btn reveal-btn" onClick={() => setShowSolutions(true)}>
            Show {q.solutions.length === 1 ? "the solution" : `${q.solutions.length} solutions`} once you have an answer on paper <kbd style={{ marginLeft: "auto" }}>S</kbd>
          </button>
        ) : (
          <>
            {q.solutions.length > 1 ? (
              <div className="tabs" role="tablist" aria-label="Solutions">
                {q.solutions.map((s, i) => (
                  <button key={i} role="tab" aria-selected={tab === i} onClick={() => setTab(i)}>
                    {s.approach}
                  </button>
                ))}
              </div>
            ) : (
              <div className="block-head"><h3>Solution: {q.solutions[0].approach}</h3></div>
            )}
            <div className="solution" key={tab} role="tabpanel"><MathText>{q.solutions[tab].text}</MathText></div>
          </>
        )}
      </section>

      <div className="problem-foot">
        <div className="group">
          <button className="btn mark-solved" aria-pressed={status === "solved"} onClick={() => onStatus(q.id, status === "solved" ? null : "solved")}>
            {status === "solved" ? "Solved" : "Mark solved"} <kbd>D</kbd>
          </button>
          <button className="btn mark-review" aria-pressed={status === "review"} onClick={() => onStatus(q.id, status === "review" ? null : "review")}>
            {status === "review" ? "Marked to review" : "Review later"} <kbd>R</kbd>
          </button>
        </div>
        <div className="group">
          <button className="btn btn-ghost" onClick={onPrev} disabled={!hasPrev}>Previous</button>
          <button className="btn btn-primary" onClick={onNext} disabled={!hasNext}>Next problem <kbd>J</kbd></button>
        </div>
      </div>
      <p className="keys-hint">
        <kbd>J</kbd> <kbd>K</kbd> move between problems{q.solutions.length > 1 && <>, <kbd>1</kbd>–<kbd>{q.solutions.length}</kbd> switch solutions</>}
      </p>
    </article>
  );
}

export default function PracticeBank() {
  const params = useSearchParams();
  const [topic, setTopic] = useState(params.get("topic") || "all");
  const [diff, setDiff] = useState("all");
  const [kind, setKind] = useState("all");
  const [show, setShow] = useState("all");
  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState(params.get("q") || null);
  const [indexOpen, setIndexOpen] = useState(false);
  const [progress, setProgress] = useStored(KEYS.progress, {});
  const listRef = useRef(null);
  const topRef = useRef(null);

  useEffect(() => {
    const t = params.get("topic");
    if (t) setTopic(t);
  }, [params]);

  const setStatus = (id, s) =>
    setProgress((p) => {
      const next = { ...p };
      if (s === null) delete next[id];
      else next[id] = s;
      return next;
    });

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return QUESTIONS.filter((q) => {
      if (topic !== "all" && q.topic !== topic) return false;
      if (diff !== "all" && String(q.difficulty) !== diff) return false;
      if (kind !== "all" && q.kind !== kind) return false;
      if (show === "open" && progress[q.id] === "solved") return false;
      if (show === "review" && progress[q.id] !== "review") return false;
      if (needle) {
        const hay = `${q.id} ${q.title} ${q.prompt} ${q.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [topic, diff, kind, show, query, progress]);

  // Keep the current problem pinned even if marking it removes it from a status filter.
  const list = useMemo(() => {
    if (!current || filtered.some((q) => q.id === current)) return filtered;
    const q = QUESTIONS.find((x) => x.id === current);
    if (!q || (topic !== "all" && q.topic !== topic)) return filtered;
    return [...filtered, q].sort((a, b) => QUESTIONS.indexOf(a) - QUESTIONS.indexOf(b));
  }, [filtered, current, topic]);

  const idx = list.findIndex((q) => q.id === current);
  const active = idx >= 0 ? list[idx] : list[0];
  const activeIdx = idx >= 0 ? idx : 0;

  const select = (id, fromIndex) => {
    setCurrent(id);
    setIndexOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.set("q", id);
    if (topic !== "all") url.searchParams.set("topic", topic);
    else url.searchParams.delete("topic");
    window.history.replaceState(null, "", url);
    if (!fromIndex && topRef.current && topRef.current.getBoundingClientRect().top < 0) {
      topRef.current.scrollIntoView({ block: "start" });
    }
  };

  // keep the active row visible in the index
  useEffect(() => {
    const el = listRef.current?.querySelector('[aria-current="true"]');
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [active?.id]);

  const groups = TOPICS.map((t) => ({ t, qs: list.filter((q) => q.topic === t.slug) })).filter((g) => g.qs.length);
  const solved = QUESTIONS.filter((q) => progress[q.id] === "solved").length;
  const review = QUESTIONS.filter((q) => progress[q.id] === "review").length;
  const filtersOn = topic !== "all" || diff !== "all" || kind !== "all" || show !== "all" || query;

  return (
    <div className="workbook" ref={topRef} style={{ scrollMarginTop: 80 }}>
      <aside className={`index ${indexOpen ? "open" : ""}`} aria-label="Problem list">
        <div className="index-filters">
          <div>
            <div className="index-progress">
              <span><b style={{ color: "var(--graphite)", fontWeight: 600 }}>{solved}</b> of {QUESTIONS.length} solved</span>
              {review > 0 && <span style={{ color: "var(--redpen)" }}>{review} to review</span>}
            </div>
            <div className="meter" aria-hidden="true">
              <i className="m-solved" style={{ width: `${(solved / QUESTIONS.length) * 100}%` }} />
              <i className="m-review" style={{ width: `${(review / QUESTIONS.length) * 100}%` }} />
            </div>
          </div>
          <input className="input" type="search" placeholder="Search problems" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search problems" />
          <div className="row">
            <select className="input" style={{ flex: "1 1 0", minWidth: 0 }} value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Topic">
              <option value="all">All topics</option>
              {TOPICS.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
            </select>
            <select className="input" style={{ flex: "1 1 0", minWidth: 0 }} value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Kind">
              <option value="all">Any kind</option>
              {Object.entries(KIND).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="seg" role="group" aria-label="Difficulty">
            {[["all", "Any level"], ["1", "Warm-up"], ["2", "Exam"], ["3", "Stretch"]].map(([v, l]) => (
              <button key={v} aria-pressed={diff === v} onClick={() => setDiff(v)}>{l}</button>
            ))}
          </div>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div className="seg" role="group" aria-label="Status">
              {[["all", "All"], ["open", "Unsolved"], ["review", "To review"]].map(([v, l]) => (
                <button key={v} aria-pressed={show === v} onClick={() => setShow(v)}>{l}</button>
              ))}
            </div>
            <button className="btn btn-sm index-toggle" onClick={() => setIndexOpen((o) => !o)} aria-expanded={indexOpen}>
              {indexOpen ? "Hide list" : `List (${list.length})`}
            </button>
          </div>
        </div>

        <div className="index-list" ref={listRef}>
          {groups.length === 0 && (
            <p className="muted" style={{ padding: "16px 8px", fontSize: "0.92rem" }}>
              Nothing matches these filters.{" "}
              <button className="btn btn-sm" onClick={() => { setTopic("all"); setDiff("all"); setKind("all"); setShow("all"); setQuery(""); }}>Clear filters</button>
            </p>
          )}
          {groups.map(({ t, qs }) => (
            <div className="index-group" key={t.slug}>
              <h3>{t.name} <span>{qs.filter((q) => progress[q.id] === "solved").length}/{qs.length}</span></h3>
              {qs.map((q) => (
                <button key={q.id} className="index-item" aria-current={active?.id === q.id} onClick={() => select(q.id, true)}>
                  <span className={`iid mark ${progress[q.id] || ""}`}>{q.id}</span>
                  <span className="ititle">{q.title}</span>
                  <Dots n={q.difficulty} />
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      <div>
        {active ? (
          <Problem
            key={active.id}
            q={active}
            status={progress[active.id]}
            onStatus={setStatus}
            hasPrev={activeIdx > 0}
            hasNext={activeIdx < list.length - 1}
            onPrev={() => select(list[activeIdx - 1].id)}
            onNext={() => select(list[activeIdx + 1].id)}
            position={`${activeIdx + 1} of ${list.length}${filtersOn ? " filtered" : ""}`}
          />
        ) : (
          <div className="problem sheet">
            <h2>No problems match</h2>
            <p className="muted">Loosen a filter on the left to bring problems back.</p>
          </div>
        )}
      </div>
    </div>
  );
}
