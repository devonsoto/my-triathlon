"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useConfidence } from "@/hooks/useConfidence";
import { useVisualization } from "@/hooks/useVisualization";
import { useMotivationalWall } from "@/hooks/useMotivationalWall";
import { DISCIPLINES, VISUALIZATION_SECTIONS } from "@/lib/constants";
import type { ConfidenceEntry } from "@/lib/types";

// ── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) {
    return <span className="text-xs text-zinc-700">No history yet</span>;
  }

  const W = 80;
  const H = 24;
  const pad = 3;
  const xStep = (W - pad * 2) / (values.length - 1);

  const points = values.map((v, i) => {
    const x = pad + i * xStep;
    const y = H - pad - ((v - 1) / 9) * (H - pad * 2);
    return { x, y };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={W} height={H} className="overflow-visible">
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.6}
      />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2} fill={color} opacity={0.9} />
      ))}
    </svg>
  );
}

// ── Confidence Meter ─────────────────────────────────────────────────────────

function ConfidenceMeter() {
  const { logRating, sparklineFor, currentFor } = useConfidence();
  const [pending, setPending] = useState<
    Record<string, number>
  >({});

  function handleLog(discipline: ConfidenceEntry["discipline"]) {
    const value = pending[discipline];
    if (!value) return;
    logRating(discipline, value);
    setPending((prev) => ({ ...prev, [discipline]: 0 }));
  }

  return (
    <section>
      <h2 className="mb-8 font-display text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">
        Confidence Check
      </h2>

      <div className="flex flex-col gap-8">
        {DISCIPLINES.map(({ key, label, emoji, accent }) => {
          const current = currentFor(key);
          const sparkline = sparklineFor(key);
          const selected = pending[key];

          return (
            <Card
              key={key}
              className="gap-0 border-0 border-l-4 bg-[#111] py-0 shadow-none"
              style={{ borderLeftColor: accent }}
            >
              <CardContent className="px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{emoji}</span>
                    <span
                      className="font-display text-xl font-bold uppercase tracking-widest"
                      style={{ color: accent }}
                    >
                      {label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Sparkline values={sparkline} color={accent} />
                    {current !== undefined && (
                      <span
                        className="font-display text-3xl font-bold"
                        style={{ color: accent }}
                      >
                        {current}
                      </span>
                    )}
                  </div>
                </div>

                {/* 1–10 buttons */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() =>
                        setPending((prev) => ({ ...prev, [key]: n }))
                      }
                      className="flex h-8 w-8 items-center justify-center rounded font-display text-sm font-bold transition-all"
                      style={
                        selected === n
                          ? {
                              backgroundColor: accent,
                              color: "#000",
                              boxShadow: `0 0 8px ${accent}88`,
                            }
                          : {
                              backgroundColor: "#1a1a1a",
                              color: "#71717a",
                              border: "1px solid #ffffff11",
                            }
                      }
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={() =>
                    handleLog(key as ConfidenceEntry["discipline"])
                  }
                  disabled={!selected}
                  size="sm"
                  className="font-display text-xs uppercase tracking-widest disabled:opacity-30"
                  style={
                    selected
                      ? { backgroundColor: accent, color: "#000" }
                      : { backgroundColor: "#1a1a1a", color: "#71717a" }
                  }
                >
                  Log Rating
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

// ── Race Day Visualization ───────────────────────────────────────────────────

function RaceDayVisualization() {
  const { notes, updateSection } = useVisualization();

  return (
    <section>
      <h2 className="mb-2 font-display text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">
        Race Day Visualization
      </h2>
      <p className="mb-8 font-sans text-xs uppercase tracking-[0.3em] text-zinc-600">
        Write it. See it. Own it. — Saves automatically on blur.
      </p>

      <div className="flex flex-col gap-8">
        {VISUALIZATION_SECTIONS.map(({ key, label, prompt }) => (
          <div key={key}>
            <div className="mb-2">
              <span className="font-display text-lg font-bold uppercase tracking-widest text-white">
                {label}
              </span>
              <span className="ml-3 font-sans text-xs text-zinc-600">
                {prompt}
              </span>
            </div>
            <Textarea
              defaultValue={notes[key] ?? ""}
              onBlur={(e) => updateSection(key, e.target.value)}
              placeholder={prompt + "…"}
              rows={4}
              className="border-white/10 bg-[#111] font-sans text-white placeholder:text-zinc-700 focus-visible:ring-white/20"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Motivational Wall ────────────────────────────────────────────────────────

function MotivationalWall() {
  const { items, addItem, deleteItem } = useMotivationalWall();
  const [quote, setQuote] = useState("");
  const [source, setSource] = useState("");

  function handleAdd() {
    if (!quote.trim()) return;
    addItem(quote.trim(), source.trim() || undefined);
    setQuote("");
    setSource("");
  }

  return (
    <section>
      <h2 className="mb-8 font-display text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">
        Motivational Wall
      </h2>

      {/* Add form */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <Input
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add a quote or mantra…"
          className="flex-1 border-white/10 bg-[#111] font-sans text-white placeholder:text-zinc-600 focus-visible:ring-white/30"
        />
        <Input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Source (optional)"
          className="w-full border-white/10 bg-[#111] font-sans text-white placeholder:text-zinc-600 focus-visible:ring-white/30 sm:w-48"
        />
        <Button
          onClick={handleAdd}
          disabled={!quote.trim()}
          className="bg-white font-display text-xs font-bold uppercase tracking-widest text-black hover:bg-zinc-200 disabled:opacity-30"
        >
          Add
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-zinc-700">
          No quotes yet. Add something that fires you up.
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card
            key={item.id}
            className="relative gap-0 border-white/10 bg-[#111] py-0 shadow-none"
          >
            <CardContent className="px-5 py-5">
              <button
                onClick={() => deleteItem(item.id)}
                className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded text-zinc-600 transition-colors hover:text-red-500"
              >
                ×
              </button>
              <p className="pr-6 font-sans text-sm leading-relaxed text-white">
                "{item.quote}"
              </p>
              {item.source && (
                <p className="mt-2 font-sans text-xs text-zinc-600">
                  — {item.source}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MentalPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-16 text-white md:px-16 lg:px-24">
      <h1 className="mb-2 font-display text-5xl font-bold uppercase tracking-widest text-white md:text-6xl">
        Mental Game
      </h1>
      <p className="mb-16 font-sans text-xs uppercase tracking-[0.3em] text-zinc-500">
        Train the mind. Win the race.
      </p>

      <ConfidenceMeter />

      <Separator className="my-16 bg-white/10" />

      <RaceDayVisualization />

      <Separator className="my-16 bg-white/10" />

      <MotivationalWall />
    </main>
  );
}
