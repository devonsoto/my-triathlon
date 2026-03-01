"use client";

import { useEffect, useState } from "react";
import type { MotivationalItem } from "@/lib/types";

const STORAGE_KEY = "tri-motivation";

function load(): MotivationalItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MotivationalItem[]) : [];
  } catch {
    return [];
  }
}

function save(items: MotivationalItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useMotivationalWall() {
  const [items, setItems] = useState<MotivationalItem[]>([]);

  useEffect(() => {
    setItems(load());
  }, []);

  function addItem(quote: string, source?: string) {
    const item: MotivationalItem = {
      id: crypto.randomUUID(),
      quote,
      source,
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => {
      const next = [item, ...prev];
      save(next);
      return next;
    });
  }

  function deleteItem(id: string) {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      save(next);
      return next;
    });
  }

  return { items, addItem, deleteItem };
}
