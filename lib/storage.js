"use client";
// Tiny localStorage helpers. Everything runs in the browser only.
import { useEffect, useState } from "react";

export const KEYS = {
  progress: "cis1600.progress.v1",
  cards: "cis1600.cards.v1",
  mock: "cis1600.mock.history.v1",
  quick: "cis1600.quick.v1",
  proof: "cis1600.proof.v1",
};

export function loadJSON(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const EVENT = "cis1600:storage";

export function saveJSON(key, value) {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(value);
    if (window.localStorage.getItem(key) === raw) return;
    window.localStorage.setItem(key, raw);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
  } catch {
    /* storage may be full or disabled; ignore */
  }
}

// State that loads from localStorage after mount and saves on every change.
export function useStored(key, fallback) {
  const [value, setValue] = useState(fallback);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setValue(loadJSON(key, fallback));
    setLoaded(true);
    // stay in sync with other components (and other tabs) writing the same key
    const reload = (e) => {
      if (e.type === "storage" ? e.key === key : e.detail === key) setValue(loadJSON(key, fallback));
    };
    window.addEventListener(EVENT, reload);
    window.addEventListener("storage", reload);
    return () => {
      window.removeEventListener(EVENT, reload);
      window.removeEventListener("storage", reload);
    };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (loaded) saveJSON(key, value);
  }, [key, value, loaded]);
  return [value, setValue, loaded];
}
