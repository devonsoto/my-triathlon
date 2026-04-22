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
  swim: "#00D4FF",
  bike: "#FF6B2B",
  run: "#7CFF4B",
};

/** Emoji + color for every discipline used across planned + logged sessions. */
export const DISCIPLINE_CONFIG: Record<DisciplineKey, { emoji: string; color: string }> = {
  swim:      { emoji: "🏊", color: "#00D4FF" },
  bike:      { emoji: "🚴", color: "#FF6B2B" },
  run:       { emoji: "🏃", color: "#7CFF4B" },
  brick:     { emoji: "💪", color: "#FFD700" },
  strength:  { emoji: "🏋️", color: "#E535AB" },
  accessory: { emoji: "🎯", color: "#B366FF" },
  soccer:    { emoji: "⚽", color: "#FFFFFF" },
};
