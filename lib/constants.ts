export const DISCIPLINES = [
  { key: "swim", label: "Swim", emoji: "🏊", accent: "#00D4FF" },
  { key: "bike", label: "Bike", emoji: "🚴", accent: "#FF6B2B" },
  { key: "run", label: "Run", emoji: "🏃", accent: "#7CFF4B" },
] as const;

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

export const VISUALIZATION_SECTIONS = [
  { key: "morning", label: "Morning Of", prompt: "How I feel and what I do" },
  { key: "swim", label: "Swim", prompt: "My approach and focus cues" },
  { key: "t1", label: "T1", prompt: "My transition plan step by step" },
  { key: "bike", label: "Bike", prompt: "My strategy and mental cues" },
  { key: "t2", label: "T2", prompt: "My transition plan step by step" },
  { key: "run", label: "Run", prompt: "How I finish strong" },
  {
    key: "finish",
    label: "Crossing the Finish",
    prompt: "How it feels",
  },
] as const;

/** Discipline accent color map for quick lookup */
export const DISCIPLINE_ACCENT: Record<string, string> = {
  swim: "#00D4FF",
  bike: "#FF6B2B",
  run: "#7CFF4B",
};
