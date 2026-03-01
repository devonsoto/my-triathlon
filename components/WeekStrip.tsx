"use client";

const DISCIPLINE_CONFIG: Record<string, { emoji: string; color: string }> = {
  swim:      { emoji: "🏊", color: "#00D4FF" },
  bike:      { emoji: "🚴", color: "#FF6B2B" },
  run:       { emoji: "🏃", color: "#7CFF4B" },
  brick:     { emoji: "💪", color: "#FFD700" },
  strength:  { emoji: "🏋️", color: "#E535AB" },
  accessory: { emoji: "🎯", color: "#B366FF" },
  soccer:    { emoji: "⚽", color: "#FFFFFF" },
};

type Session = { discipline: string; label: string } | null;

const WEEKLY_SCHEDULE: { day: string; am: Session; pm: Session }[] = [
  { day: "Mon", am: { discipline: "strength",  label: "ALPHA"     }, pm: null },
  { day: "Tue", am: { discipline: "strength",  label: "ALPHA"     }, pm: { discipline: "swim",      label: "Swim"      } },
  { day: "Wed", am: { discipline: "run",       label: "Run"       }, pm: { discipline: "swim",      label: "Swim"      } },
  { day: "Thu", am: { discipline: "strength",  label: "ALPHA"     }, pm: { discipline: "soccer",    label: "Soccer"    } },
  { day: "Fri", am: { discipline: "accessory", label: "Accessory" }, pm: { discipline: "bike",      label: "Bike"      } },
  { day: "Sat", am: { discipline: "brick",     label: "Brick"     }, pm: null },
  { day: "Sun", am: { discipline: "soccer",    label: "Soccer"    }, pm: null },
];

function getCurrentWeekDates(): Date[] {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function SessionRow({ session, slot }: { session: Session; slot: "AM" | "PM" }) {
  if (!session) {
    return (
      <div className="flex items-center gap-1.5 pl-2">
        <span className="font-mono text-[10px] text-zinc-700">{slot}</span>
        <span className="font-sans text-[10px] text-zinc-700">—</span>
      </div>
    );
  }

  const config = DISCIPLINE_CONFIG[session.discipline] ?? { emoji: "•", color: "#666" };

  return (
    <div
      className="flex items-center gap-1.5 border-l-2 pl-2"
      style={{ borderColor: config.color }}
    >
      <span className="font-mono text-[10px]" style={{ color: config.color }}>{slot}</span>
      <span className="text-[11px]">{config.emoji}</span>
      <span
        className="font-display truncate text-[11px] font-semibold uppercase leading-none tracking-wide"
        style={{ color: config.color }}
      >
        {session.label}
      </span>
    </div>
  );
}

export default function WeekStrip() {
  const weekDates = getCurrentWeekDates();
  const today = new Date();

  return (
    <section className="mb-16">
      <p className="mb-4 text-center font-sans text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
        This Week
      </p>

      {/* Scrollable on mobile, flex row on desktop */}
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-2" style={{ minWidth: "616px" }}>
          {WEEKLY_SCHEDULE.map(({ day, am, pm }, i) => {
            const date = weekDates[i];
            const isToday = date.toDateString() === today.toDateString();
            const isPast = date < today && !isToday;

            const monthLabel = date.toLocaleDateString("en-US", { month: "short" });
            const dateNum = date.getDate();

            return (
              <div
                key={day}
                className={[
                  "flex flex-1 flex-col gap-2 rounded-lg border p-2.5 transition-opacity",
                  isToday
                    ? "border-white/30 bg-[#1E1E1E] shadow-[0_0_12px_rgba(255,255,255,0.08)]"
                    : isPast
                    ? "border-white/5 bg-[#111] opacity-40"
                    : "border-white/5 bg-[#111]",
                ].join(" ")}
                style={
                  isToday
                    ? { boxShadow: "0 0 0 1px rgba(255,255,255,0.15), 0 0 16px rgba(255,255,255,0.06)" }
                    : {}
                }
              >
                {/* Day header */}
                <div className="flex items-baseline justify-between">
                  <span
                    className={[
                      "font-display text-xs font-bold uppercase tracking-widest",
                      isToday ? "text-white" : "text-zinc-400",
                    ].join(" ")}
                  >
                    {day}
                  </span>
                  <span className="font-sans text-[10px] text-zinc-600">
                    {monthLabel} {dateNum}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-white/5" />

                {/* Sessions */}
                <div className="flex flex-col gap-1.5">
                  <SessionRow session={am} slot="AM" />
                  <SessionRow session={pm} slot="PM" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
