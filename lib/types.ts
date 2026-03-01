export interface JournalEntry {
  id: string;
  date: string; // "YYYY-MM-DD"
  title: string;
  mood: string; // emoji
  disciplines: string[];
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConfidenceEntry {
  discipline: "swim" | "bike" | "run";
  value: number; // 1–10
  date: string; // "YYYY-MM-DD"
}

export interface MotivationalItem {
  id: string;
  quote: string;
  source?: string;
  createdAt: string;
}
