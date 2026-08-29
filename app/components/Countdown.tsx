"use client";

import { useEffect, useState, useCallback } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function getTimeLeft(target: Date): TimeLeft {
  const now = new Date().getTime();
  const diff = target.getTime() - now;

  if (diff <= 0) return ZERO;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function padTwo(n: number): string {
  return n.toString().padStart(2, "0");
}

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<TimeLeft>(ZERO);
  const [isExpired, setIsExpired] = useState(false);
  const [changing, setChanging] = useState<Record<string, boolean>>({});

  const target = new Date(targetDate);

  // Only start after hydration to avoid mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const initialTime = getTimeLeft(target);
    setTime(initialTime);
    if (initialTime === ZERO) {
      setIsExpired(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tick = useCallback(() => {
    setTime((prev) => {
      const next = getTimeLeft(target);

      if (next === ZERO) {
        setIsExpired(true);
        return next;
      }

      const newChanging: Record<string, boolean> = {};
      if (prev.days !== next.days) newChanging.days = true;
      if (prev.hours !== next.hours) newChanging.hours = true;
      if (prev.minutes !== next.minutes) newChanging.minutes = true;
      if (prev.seconds !== next.seconds) newChanging.seconds = true;
      setChanging(newChanging);

      setTimeout(() => setChanging({}), 400);
      return next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mounted || isExpired) return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [mounted, isExpired, tick]);

  const units: { key: keyof TimeLeft; label: string }[] = [
    { key: "days", label: "Days" },
    { key: "hours", label: "Hours" },
    { key: "minutes", label: "Mins" },
    { key: "seconds", label: "Secs" },
  ];

  if (isExpired && mounted) {
    return (
      <div className="flex items-center justify-center text-[#1a1a1a] py-4" role="status" aria-label="We are live">
        <span className="font-display text-2xl md:text-3xl font-medium tracking-widest uppercase">
          We Are Live
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 md:gap-4 text-[#1a1a1a] justify-center" role="timer" aria-label="Countdown to launch">
      {units.map((unit, i) => (
        <div key={unit.key} style={{ display: "contents" }}>
          {i > 0 && (
            <span className="text-xl md:text-2xl font-light opacity-50 pb-4 md:pb-5" aria-hidden="true">
              :
            </span>
          )}
          <div className="flex flex-col items-center">
            <div className="font-display text-3xl md:text-5xl font-medium tracking-wide w-12 md:w-16 text-center text-[#1a1a1a]" aria-label={`${time[unit.key]} ${unit.label}`}>
              <span className={`inline-block transition-transform duration-300 ${changing[unit.key] ? "scale-90 opacity-70" : "scale-100 opacity-100"}`}>
                {mounted ? padTwo(time[unit.key]) : "--"}
              </span>
            </div>
            <span className="text-[0.5rem] md:text-[0.55rem] font-medium tracking-widest uppercase mt-1 md:mt-2 text-[#5a5a5a]">{unit.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
