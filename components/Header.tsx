"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Dashboard", href: "/athlete" },
  { label: "Journal", href: "/athlete/journal" },
  { label: "Mental", href: "/athlete/mental" },
] as const;

const TRI_COLORS = ["#00D4FF", "#FF6B2B", "#7CFF4B"] as const;

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0A0A0A]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 md:px-16">
        {/* Brand */}
        <Link href="/athlete" className="flex items-center gap-3 group">
          <div className="flex items-center gap-[4px]">
            {TRI_COLORS.map((color) => (
              <span
                key={color}
                className="block h-4 w-[3px] rounded-full transition-all duration-300 group-hover:h-5"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span className="font-display text-sm font-bold uppercase tracking-[0.25em] text-white">
            My Triathlon
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6 md:gap-8">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "relative font-display text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-200",
                  isActive
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-200",
                ].join(" ")}
              >
                {label}
                {isActive && (
                  <span className="absolute -bottom-[18px] left-0 right-0 h-[2px] bg-white" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Tri-color bottom stripe */}
      <div className="absolute bottom-0 left-0 right-0 flex h-[2px]">
        {TRI_COLORS.map((color) => (
          <div key={color} className="flex-1" style={{ backgroundColor: color }} />
        ))}
      </div>
    </header>
  );
}
