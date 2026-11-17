"use client";

import { useEffect, useMemo, useState } from "react";
import { FLASHCARDS } from "../lib/flashcards";
import { TOPIC_BY_SLUG, TOPICS } from "../lib/topics";
import { KEYS, useStored } from "../lib/storage";
import MathText from "./MathText";

// Leitner boxes: "got it" moves a card up a box, a miss sends it back to box 1.
// Each round deals the lowest boxes first, oldest-seen first.

export default function Flashcards() {
  const [topic, setTopic] = useState("all");
  const [boxes, setBoxes, loaded] = useStored(KEYS.cards, {});
  const [deck, setDeck] = useState([]);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [round, setRound] = useState(0);
  const [tally, setTally] = useState({ got: 0, missed: 0 });

  const pool = useMemo(() => FLASHCARDS.filter((c) => topic === "all" || c.topic === topic), [topic]);

  useEffect(() => {
    if (!loaded) return;
    const ordered = pool
      .map((c) => ({ c, box: boxes[c.id]?.box || 1, last: boxes[c.id]?.seen || 0 }))
      .sort((a, b) => a.box - b.box || a.last - b.last)
      .map((x) => x.c);
    setDeck(ordered);
    setI(0);
    setFlipped(false);
    setTally({ got: 0, missed: 0 });
  }, [pool, loaded, round]); // eslint-disable-line react-hooks/exhaustive-deps

  const card = deck[i];
  const box = card ? boxes[card.id]?.box || 1 : 1;

  const grade = (correct) => {
    if (!card || !flipped) return;
    setBoxes((b) => {
      const prev = b[card.id]?.box || 1;
      return { ...b, [card.id]: { box: correct ? Math.min(5, prev + 1) : 1, seen: Date.now() } };
    });
    setTally((t) => (correct ? { ...t, got: t.got + 1 } : { ...t, missed: t.missed + 1 }));
    setFlipped(false);
    setI((n) => n + 1);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName) || e.metaKey || e.ctrlKey) return;
      if (e.key === " " || e.key === "Enter") {
        if (e.target.tagName === "BUTTON" && e.target.dataset.flip !== "1") return;
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "1") grade(false);
      else if (e.key === "2") grade(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const counts = useMemo(() => {
    const c = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    pool.forEach((card) => { c[boxes[card.id]?.box || 1] += 1; });
    return c;
  }, [boxes, pool]);
  const maxCount = Math.max(1, ...Object.values(counts));

  return (
    <div className="deck-layout">
      <div>
        {!loaded ? (
          <div style={{ minHeight: 420 }} />
        ) : !card ? (
          <div className="index-card-stage">
            <div className="face front" style={{ position: "relative", aspectRatio: "5 / 3" }}>
              <div className="term">Round done</div>
              <p className="muted" style={{ marginTop: 10, maxWidth: "36ch" }}>
                {tally.got} got, {tally.missed} missed. The missed cards are back in box 1 and come first next round.
              </p>
              <button className="btn btn-primary" onClick={() => setRound((r) => r + 1)}>Deal another round</button>
            </div>
          </div>
        ) : (
          <>
            <div className="card-count">
              Card {i + 1} of {deck.length}
              {(tally.got > 0 || tally.missed > 0) && <> &nbsp; {tally.got} got, {tally.missed} missed this round</>}
            </div>
            <div className="index-card-stage">
              <div
                className={`index-card ${flipped ? "flipped" : ""}`}
                onClick={() => setFlipped((f) => !f)}
                role="button"
                tabIndex={0}
                data-flip="1"
                aria-label={flipped ? `Answer: ${card.back}. Click to see the front.` : `${card.front}. Click to see the answer.`}
              >
                <div className="face front">
                  <span className="card-topic">{TOPIC_BY_SLUG[card.topic]?.name}</span>
                  <span className="card-box">Box {box}</span>
                  <div className="term"><MathText>{card.front}</MathText></div>
                </div>
                <div className="face back">
                  <div className="back-term">{card.front}</div>
                  <div className="back-text"><MathText>{card.back}</MathText></div>
                </div>
              </div>
            </div>
            <div className="card-controls">
              {!flipped ? (
                <button className="btn btn-primary" onClick={() => setFlipped(true)} style={{ minWidth: 200 }}>
                  Show answer <kbd>Space</kbd>
                </button>
              ) : (
                <>
                  <button className="btn mark-review" aria-pressed="true" onClick={() => grade(false)} style={{ minWidth: 150 }}>
                    Missed it <kbd>1</kbd>
                  </button>
                  <button className="btn mark-solved" aria-pressed="true" onClick={() => grade(true)} style={{ minWidth: 150 }}>
                    Got it <kbd>2</kbd>
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <aside className="boxes">
        <div>
          <label htmlFor="deck-topic" style={{ fontSize: "0.9rem", fontWeight: 500, display: "block", marginBottom: 6 }}>Deck</label>
          <select id="deck-topic" className="input" value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="all">All topics ({FLASHCARDS.length})</option>
            {TOPICS.map((t) => (
              <option key={t.slug} value={t.slug}>{t.name} ({FLASHCARDS.filter((c) => c.topic === t.slug).length})</option>
            ))}
          </select>
        </div>
        <div>
          <h3 style={{ marginBottom: 4 }}>Boxes</h3>
          <p style={{ marginBottom: 12 }}>Box 1 holds new and missed cards. Boxes 4 and 5 count as mastered.</p>
          <div style={{ display: "grid", gap: 8 }}>
            {[1, 2, 3, 4, 5].map((b) => (
              <div key={b} className={`box-row ${b >= 4 ? "mastered" : ""}`}>
                <span>Box {b}</span>
                <span className="stack"><i style={{ width: `${(counts[b] / maxCount) * 100}%` }} /></span>
                <span>{counts[b]}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          className="btn btn-sm btn-ghost"
          style={{ justifySelf: "start", paddingLeft: 0 }}
          onClick={() => {
            if (window.confirm("Move every card back to box 1?")) {
              setBoxes({});
              setRound((r) => r + 1);
            }
          }}
        >
          Reset all cards to box 1
        </button>
      </aside>
    </div>
  );
}
