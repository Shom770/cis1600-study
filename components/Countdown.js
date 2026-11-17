"use client";

import { useEffect, useState } from "react";

// Section 001 sits in BENN 419 at 8:30. Exam is Thursday Nov 19, 2026.
export const EXAM = new Date(2026, 10, 19, 8, 30, 0);

function parts(now) {
  const ms = Math.max(0, EXAM - now);
  return {
    ms,
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    mins: Math.floor((ms % 3600000) / 60000),
  };
}

export function useCountdown() {
  const [t, setT] = useState(null);
  useEffect(() => {
    setT(parts(new Date()));
    const id = setInterval(() => setT(parts(new Date())), 20000);
    return () => clearInterval(id);
  }, []);
  return t;
}
