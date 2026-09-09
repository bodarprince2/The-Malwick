"use client";

import { useState, useRef, useEffect } from "react";

export default function CustomDropdown({
  value,
  options,
  onChange,
  className = "",
  compact = false,
}: {
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
  className?: string;
  compact?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label || value;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border border-[#1a1a1a]/10 flex items-center justify-between transition-colors focus:outline-none ${
          compact ? "px-2 py-1 text-[10px] font-bold" : "px-4 py-3.5 text-xs font-semibold"
        } tracking-widest uppercase text-[#1a1a1a] hover:border-[#1a1a1a]/30`}
      >
        <span className="truncate">{selectedLabel}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform duration-300 flex-shrink-0 ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#1a1a1a]/10 shadow-xl z-50 animate-fade-in origin-top">
          <div className="max-h-[300px] overflow-y-auto hide-scrollbar">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left transition-colors hover:bg-[#1a1a1a]/5 ${
                  compact ? "px-2 py-2 text-[10px] font-bold" : "px-4 py-3 text-xs font-semibold"
                } tracking-widest uppercase ${
                  value === opt.value ? "text-[#b8976a] bg-[#1a1a1a]/5" : "text-[#1a1a1a]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
