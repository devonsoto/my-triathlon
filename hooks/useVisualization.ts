"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "tri-visualization";

function load(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function save(notes: Record<string, string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function useVisualization() {
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    setNotes(load());
  }, []);

  function updateSection(key: string, value: string) {
    setNotes((prev) => {
      const next = { ...prev, [key]: value };
      save(next);
      return next;
    });
  }

  return { notes, updateSection };
}
