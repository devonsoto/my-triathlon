"use client";

import { useEffect, useState } from "react";
import type { JournalEntry } from "@/lib/types";

const STORAGE_KEY = "tri-journal";

const SEED_ENTRIES: JournalEntry[] = [
  {
    id: "seed-1",
    date: "2026-02-10",
    title: "First open water swim of the season",
    mood: "🔥",
    disciplines: ["Swim"],
    content:
      "Got out to the reservoir early. Water was cold but I felt strong after the first 200m. Breathing settled down and I found a rhythm. Sighting was off — need to work on that. Overall a huge confidence boost after months in the pool.",
    createdAt: "2026-02-10T07:30:00Z",
    updatedAt: "2026-02-10T07:30:00Z",
  },
  {
    id: "seed-2",
    date: "2026-02-15",
    title: "Brick workout — bike to run transition",
    mood: "😅",
    disciplines: ["Bike", "Run"],
    content:
      "45min on the bike at race pace, then straight into a 20min run. Legs felt like lead for the first 5 minutes but eventually loosened up. Transition was sloppy — forgot to rack the helmet properly in practice. Will drill T2 next week.",
    createdAt: "2026-02-15T09:00:00Z",
    updatedAt: "2026-02-15T09:00:00Z",
  },
  {
    id: "seed-3",
    date: "2026-02-20",
    title: "Rest day reflection",
    mood: "😊",
    disciplines: ["Rest"],
    content:
      "Full rest today. Spent time visualizing the race course. Feeling good about where my fitness is. Nutrition has been dialed in this week — no afternoon crashes. 51 days out and I feel ready to push harder.",
    createdAt: "2026-02-20T18:00:00Z",
    updatedAt: "2026-02-20T18:00:00Z",
  },
];

function load(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_ENTRIES;
    return JSON.parse(raw) as JournalEntry[];
  } catch {
    return SEED_ENTRIES;
  }
}

function save(entries: JournalEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const loaded = load();
    setEntries(loaded);
    // Seed localStorage if it was empty
    if (!localStorage.getItem(STORAGE_KEY)) {
      save(loaded);
    }
  }, []);

  function addEntry(entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setEntries((prev) => {
      const next = [newEntry, ...prev];
      save(next);
      return next;
    });
  }

  function deleteEntry(id: string) {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      save(next);
      return next;
    });
  }

  // Newest first
  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return { entries: sorted, addEntry, deleteEntry };
}
