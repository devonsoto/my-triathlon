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
