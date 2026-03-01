"use client";

import { useEffect, useState } from "react";
import type { ConfidenceEntry } from "@/lib/types";

const STORAGE_KEY = "tri-confidence";

function load(): ConfidenceEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConfidenceEntry[]) : [];
  } catch {
    return [];
  }
}

function save(entries: ConfidenceEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useConfidence() {
  const [history, setHistory] = useState<ConfidenceEntry[]>([]);

  useEffect(() => {
    setHistory(load());
  }, []);

  function logRating(
    discipline: ConfidenceEntry["discipline"],
    value: number
  ) {
    const entry: ConfidenceEntry = {
      discipline,
      value,
      date: new Date().toISOString().slice(0, 10),
    };
    setHistory((prev) => {
      const next = [...prev, entry];
      save(next);
      return next;
    });
  }

  /** Last 5 logged entries per discipline, oldest → newest */
  function sparklineFor(discipline: ConfidenceEntry["discipline"]): number[] {
    return history
      .filter((e) => e.discipline === discipline)
      .slice(-5)
      .map((e) => e.value);
  }

  /** Most recently logged value per discipline (or undefined if none) */
  function currentFor(
    discipline: ConfidenceEntry["discipline"]
  ): number | undefined {
    const entries = history.filter((e) => e.discipline === discipline);
    return entries.length > 0 ? entries[entries.length - 1].value : undefined;
  }

  return { history, logRating, sparklineFor, currentFor };
}
