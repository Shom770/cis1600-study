"use client";

import { QUESTIONS } from "../lib/questions";
import { KEYS, useStored } from "../lib/storage";
import { useCountdown } from "./Countdown";

export default function NavProgress() {
  const [progress, , loaded] = useStored(KEYS.progress, {});
  const t = useCountdown();
  const solved = QUESTIONS.filter((q) => progress[q.id] === "solved").length;
  return (
    <div className="nav-progress">
      {loaded && (
        <>
          <span className="nav-bar" aria-hidden="true"><i style={{ width: `${(solved / QUESTIONS.length) * 100}%` }} /></span>
          <span className="tnum">{solved} of {QUESTIONS.length}</span>
        </>
      )}
      {t && (
        <span className="exam-pill tnum">
          {t.ms === 0 ? "Exam day" : `Exam in ${t.days > 0 ? `${t.days}d ${t.hours}h` : `${t.hours}h ${t.mins}m`}`}
        </span>
      )}
    </div>
  );
}
