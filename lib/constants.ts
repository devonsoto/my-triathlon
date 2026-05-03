import type { DisciplineKey } from "@/lib/whoop/sports";

export type { DisciplineKey };

export const DISCIPLINE_TAGS = [
  "Swim",
  "Bike",
  "Run",
  "Brick",
  "Rest",
  "General",
] as const;

export const MOODS = [
  { emoji: "🔥", label: "Fired up" },
  { emoji: "💪", label: "Strong" },
  { emoji: "😊", label: "Good" },
  { emoji: "😅", label: "Tough" },
  { emoji: "😤", label: "Frustrated" },
  { emoji: "🤕", label: "Sore" },
] as const;

/** Discipline accent color map for quick lookup */
export const DISCIPLINE_ACCENT: Record<string, string> = {
  swim: "#3B82F6",
  bike: "#F97316",
  run: "#22C55E",
};

/** Emoji + color for every discipline used across planned + logged sessions. */
export const DISCIPLINE_CONFIG: Record<DisciplineKey, { emoji: string; color: string }> = {
  swim:      { emoji: "🏊", color: "#3B82F6" },
  bike:      { emoji: "🚴", color: "#F97316" },
  run:       { emoji: "🏃", color: "#22C55E" },
  brick:     { emoji: "💪", color: "#FFD700" },
  strength:  { emoji: "🏋️", color: "#E535AB" },
  accessory: { emoji: "🎯", color: "#B366FF" },
  soccer:    { emoji: "⚽", color: "#FFFFFF" },
};
