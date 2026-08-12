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
  const [changing, setChanging] = useState<Record<string, boolean>>({});

  const target = new Date(targetDate);

  // Only start after hydration to avoid mismatch
  useEffect(() => {
    setMounted(true);
    setTime(getTimeLeft(target));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tick = useCallback(() => {
    setTime((prev) => {
      const next = getTimeLeft(target);

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
    if (!mounted) return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [mounted, tick]);

  const units: { key: keyof TimeLeft; label: string }[] = [
    { key: "days", label: "Days" },
    { key: "hours", label: "Hours" },
    { key: "minutes", label: "Minutes" },
    { key: "seconds", label: "Seconds" },
  ];

  return (
    <div className="countdown" role="timer" aria-label="Countdown to launch">
      {units.map((unit, i) => (
        <div key={unit.key} style={{ display: "contents" }}>
          {i > 0 && (
            <span className="countdown-separator" aria-hidden="true">
              :
            </span>
          )}
          <div className="countdown-unit">
            <div className="countdown-value" aria-label={`${time[unit.key]} ${unit.label}`}>
              <span className={`digit ${changing[unit.key] ? "changing" : ""}`}>
                {mounted ? padTwo(time[unit.key]) : "--"}
              </span>
            </div>
            <span className="countdown-label">{unit.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
