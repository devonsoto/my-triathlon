"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useJournal } from "@/hooks/useJournal";
import { DISCIPLINE_TAGS, MOODS, DISCIPLINE_ACCENT } from "@/lib/constants";
import type { JournalEntry } from "@/lib/types";

type View = "list" | "detail" | "new";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Derive a left-border accent color from the first known discipline in an entry */
function primaryAccent(disciplines: string[]): string {
  for (const d of disciplines) {
    const color = DISCIPLINE_ACCENT[d.toLowerCase()];
    if (color) return color;
  }
  return "#ffffff22";
}

// ── Filter bar ──────────────────────────────────────────────────────────────

function PillToggle({
  active,
  onClick,
  children,
  color,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors"
      style={
        active
          ? {
              borderColor: color ?? "#fff",
              color: color ?? "#fff",
              backgroundColor: color ? color + "22" : "#ffffff22",
            }
          : { borderColor: "#ffffff22", color: "#71717a" }
      }
    >
      {children}
    </button>
  );
}

// ── List view ────────────────────────────────────────────────────────────────

function ListView({
  entries,
  onSelect,
  onNew,
}: {
  entries: JournalEntry[];
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  const [disciplineFilter, setDisciplineFilter] = useState<string>("All");
  const [moodFilter, setMoodFilter] = useState<string>("All");

  const filtered = entries.filter((e) => {
    const matchDiscipline =
      disciplineFilter === "All" ||
      e.disciplines.map((d) => d.toLowerCase()).includes(disciplineFilter.toLowerCase());
    const matchMood = moodFilter === "All" || e.mood === moodFilter;
    return matchDiscipline && matchMood;
  });

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] px-6 py-16 text-white md:px-16 lg:px-24">
      <h1 className="mb-2 font-display text-5xl font-bold uppercase tracking-widest text-white md:text-6xl">
        Training Log
      </h1>
      <p className="mb-8 font-sans text-xs uppercase tracking-[0.3em] text-zinc-500">
        {entries.length} {entries.length === 1 ? "entry" : "entries"}
      </p>

      {/* Discipline filter */}
      <div className="mb-3 flex flex-wrap gap-2">
        {["All", ...DISCIPLINE_TAGS].map((tag) => (
          <PillToggle
            key={tag}
            active={disciplineFilter === tag}
            onClick={() => setDisciplineFilter(tag)}
            color={DISCIPLINE_ACCENT[tag.toLowerCase()]}
          >
            {tag}
          </PillToggle>
        ))}
      </div>

      {/* Mood filter */}
      <div className="mb-10 flex flex-wrap gap-2">
        <PillToggle
          active={moodFilter === "All"}
          onClick={() => setMoodFilter("All")}
        >
          All moods
        </PillToggle>
        {MOODS.map(({ emoji }) => (
          <PillToggle
            key={emoji}
            active={moodFilter === emoji}
            onClick={() => setMoodFilter(emoji)}
          >
            {emoji}
          </PillToggle>
        ))}
      </div>

      {/* Entries */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 && (
          <p className="text-sm text-zinc-600">No entries match your filters.</p>
        )}
        {filtered.map((entry) => (
          <Card
            key={entry.id}
            onClick={() => onSelect(entry.id)}
            className="cursor-pointer gap-0 rounded-lg border-0 border-l-4 bg-[#111] py-0 shadow-none transition-colors hover:bg-[#1a1a1a]"
            style={{ borderLeftColor: primaryAccent(entry.disciplines) }}
          >
            <CardContent className="px-6 py-5">
              <div className="mb-2 flex items-center gap-3">
                <span className="font-sans text-xs text-zinc-500">
                  {formatDate(entry.date)}
                </span>
                <span className="text-base">{entry.mood}</span>
                <div className="flex gap-1">
                  {entry.disciplines.map((d) => (
                    <Badge
                      key={d}
                      className="rounded-sm border-0 px-2 py-0 text-[10px] font-bold uppercase"
                      style={{
                        backgroundColor:
                          (DISCIPLINE_ACCENT[d.toLowerCase()] ?? "#fff") + "22",
                        color: DISCIPLINE_ACCENT[d.toLowerCase()] ?? "#fff",
                      }}
                    >
                      {d}
                    </Badge>
                  ))}
                </div>
              </div>
              <h2 className="mb-1 font-display text-xl font-bold uppercase tracking-wide text-white">
                {entry.title}
              </h2>
              <p className="font-sans text-sm leading-relaxed text-zinc-400">
                {entry.content.length > 120
                  ? entry.content.slice(0, 120) + "…"
                  : entry.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Floating new entry button */}
      <button
        onClick={onNew}
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl font-bold text-black shadow-lg transition-transform hover:scale-110"
      >
        +
      </button>
    </div>
  );
}

// ── Detail view ──────────────────────────────────────────────────────────────

function DetailView({
  entry,
  onBack,
  onDelete,
}: {
  entry: JournalEntry;
  onBack: () => void;
  onDelete: (id: string) => void;
}) {
  function handleDelete() {
    if (window.confirm("Delete this entry?")) {
      onDelete(entry.id);
      onBack();
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 py-16 text-white md:px-16 lg:px-24">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-zinc-500 transition-colors hover:text-white"
      >
        ← Back
      </button>

      <div className="mb-4 flex items-center gap-3">
        <span className="font-sans text-xs text-zinc-500">
          {formatDate(entry.date)}
        </span>
        <span className="text-xl">{entry.mood}</span>
        <div className="flex gap-1">
          {entry.disciplines.map((d) => (
            <Badge
              key={d}
              className="rounded-sm border-0 px-2 py-0 text-[10px] font-bold uppercase"
              style={{
                backgroundColor:
                  (DISCIPLINE_ACCENT[d.toLowerCase()] ?? "#fff") + "22",
                color: DISCIPLINE_ACCENT[d.toLowerCase()] ?? "#fff",
              }}
            >
              {d}
            </Badge>
          ))}
        </div>
      </div>

      <h1
        className="mb-8 font-display text-4xl font-bold uppercase tracking-wide text-white md:text-5xl"
        style={{ borderLeft: `4px solid ${primaryAccent(entry.disciplines)}`, paddingLeft: "1rem" }}
      >
        {entry.title}
      </h1>

      <p className="max-w-2xl font-sans text-base leading-8 text-zinc-300 whitespace-pre-wrap">
        {entry.content}
      </p>

      <div className="mt-12">
        <Button
          onClick={handleDelete}
          variant="outline"
          className="border-red-900 bg-transparent font-sans text-xs uppercase tracking-widest text-red-600 hover:bg-red-950 hover:text-red-400"
        >
          Delete Entry
        </Button>
      </div>
    </div>
  );
}

// ── New entry form ───────────────────────────────────────────────────────────

function NewEntryForm({
  onSave,
  onBack,
}: {
  onSave: (entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => void;
  onBack: () => void;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today());
  const [mood, setMood] = useState("");
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [content, setContent] = useState("");

  function toggleDiscipline(tag: string) {
    setDisciplines((prev) =>
      prev.includes(tag) ? prev.filter((d) => d !== tag) : [...prev, tag]
    );
  }

  function handleSave() {
    if (!title.trim() || !mood || disciplines.length === 0 || !content.trim())
      return;
    onSave({ title, date, mood, disciplines, content });
  }

  const isValid =
    title.trim() && mood && disciplines.length > 0 && content.trim();

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 py-16 text-white md:px-16 lg:px-24">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-zinc-500 transition-colors hover:text-white"
      >
        ← Back
      </button>

      <h1 className="mb-10 font-display text-4xl font-bold uppercase tracking-widest text-white">
        New Entry
      </h1>

      <div className="flex max-w-2xl flex-col gap-8">
        {/* Title */}
        <div>
          <label className="mb-2 block font-sans text-xs uppercase tracking-widest text-zinc-500">
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What did you work on?"
            className="border-white/10 bg-[#111] font-sans text-white placeholder:text-zinc-600 focus-visible:ring-white/30"
          />
        </div>

        {/* Date */}
        <div>
          <label className="mb-2 block font-sans text-xs uppercase tracking-widest text-zinc-500">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-[#111] px-3 py-2 font-sans text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30"
          />
        </div>

        {/* Mood */}
        <div>
          <label className="mb-3 block font-sans text-xs uppercase tracking-widest text-zinc-500">
            Mood
          </label>
          <div className="flex flex-wrap gap-3">
            {MOODS.map(({ emoji, label }) => (
              <button
                key={emoji}
                onClick={() => setMood(emoji)}
                title={label}
                className="flex h-12 w-12 items-center justify-center rounded-full border text-2xl transition-all"
                style={
                  mood === emoji
                    ? { borderColor: "#fff", backgroundColor: "#ffffff22" }
                    : { borderColor: "#ffffff22" }
                }
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Disciplines */}
        <div>
          <label className="mb-3 block font-sans text-xs uppercase tracking-widest text-zinc-500">
            Disciplines
          </label>
          <div className="flex flex-wrap gap-2">
            {DISCIPLINE_TAGS.map((tag) => (
              <PillToggle
                key={tag}
                active={disciplines.includes(tag)}
                onClick={() => toggleDiscipline(tag)}
                color={DISCIPLINE_ACCENT[tag.toLowerCase()]}
              >
                {tag}
              </PillToggle>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="mb-2 block font-sans text-xs uppercase tracking-widest text-zinc-500">
            Entry
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="How did it go? What did you learn? How did you feel?"
            rows={8}
            className="border-white/10 bg-[#111] font-sans text-white placeholder:text-zinc-600 focus-visible:ring-white/30"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={!isValid}
          className="w-full bg-white font-display text-sm font-bold uppercase tracking-widest text-black hover:bg-zinc-200 disabled:opacity-30"
        >
          Save Entry
        </Button>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function JournalPage() {
  const { entries, addEntry, deleteEntry } = useJournal();
  const [view, setView] = useState<View>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedEntry = entries.find((e) => e.id === selectedId) ?? null;

  if (view === "new") {
    return (
      <NewEntryForm
        onBack={() => setView("list")}
        onSave={(entry) => {
          addEntry(entry);
          setView("list");
        }}
      />
    );
  }

  if (view === "detail" && selectedEntry) {
    return (
      <DetailView
        entry={selectedEntry}
        onBack={() => setView("list")}
        onDelete={(id) => {
          deleteEntry(id);
          setView("list");
        }}
      />
    );
  }

  return (
    <ListView
      entries={entries}
      onSelect={(id) => {
        setSelectedId(id);
        setView("detail");
      }}
      onNew={() => setView("new")}
    />
  );
}
