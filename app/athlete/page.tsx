"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import WeekStrip from "@/components/WeekStrip";

// ─── Athlete config — swap these values for dynamic data later ───────────────
const ATHLETE = {
  name: "Devon Soto",
  raceDate: new Date("2026-04-12T07:00:00"),
  raceLabel: "Sprint Triathlon · April 12, 2026",
};

const DISCIPLINES = [
  { name: "Swim", emoji: "🏊", accent: "#00D4FF" },
  { name: "Bike", emoji: "🚴", accent: "#FF6B2B" },
  { name: "Run", emoji: "🏃", accent: "#7CFF4B" },
] as const;
// ─────────────────────────────────────────────────────────────────────────────

function getDaysLeft(target: Date): number {
  const diff = target.getTime() - Date.now();
  return diff <= 0 ? 0 : Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function AthletePage() {
  const [days, setDays] = useState(() => getDaysLeft(ATHLETE.raceDate));

  useEffect(() => {
    const id = setInterval(() => {
      setDays(getDaysLeft(ATHLETE.raceDate));
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white px-6 py-16 md:px-16 lg:px-24">
      {/* ── Hero ── */}
      <section className="mb-16 text-center">
        <h1 className="font-display text-6xl font-bold uppercase tracking-widest text-white md:text-8xl lg:text-9xl">
          {ATHLETE.name}
        </h1>
        <p className="mt-3 font-sans text-sm uppercase tracking-[0.3em] text-zinc-400 md:text-base">
          {ATHLETE.raceLabel}
        </p>
      </section>

      {/* ── Countdown ── */}
      <section className="mb-20 flex justify-center">
        <Card className="items-center border-white/10 bg-[#111] px-10 py-8 text-center">
          <CardContent className="p-0">
            <span className="font-display text-8xl font-bold leading-none text-white md:text-9xl">
              {days}
            </span>
          </CardContent>
          <CardDescription className="mt-2 font-sans text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Days to Race Day
          </CardDescription>
        </Card>
      </section>

      {/* ── Week strip ── */}
      <WeekStrip />

      {/* ── Discipline cards ── */}
      <section>
        <p className="mb-6 text-center font-sans text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
          Disciplines
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {DISCIPLINES.map(({ name, emoji, accent }) => (
            <Card
              key={name}
              className="gap-0 rounded-lg border-0 border-t-4 bg-[#111] p-8"
              style={{ borderTopColor: accent }}
            >
              <CardContent className="p-0">
                <div className="mb-4 text-4xl">{emoji}</div>
                <CardTitle
                  className="font-display text-4xl font-bold uppercase tracking-wide"
                  style={{ color: accent }}
                >
                  {name}
                </CardTitle>
                <CardDescription className="mt-4 font-sans text-xs uppercase tracking-widest text-zinc-600">
                  Stats coming soon
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
