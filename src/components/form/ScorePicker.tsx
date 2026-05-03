"use client";

import { Minus, Plus } from "lucide-react";

interface ScorePickerProps {
  value: number;
  onChange: (value: number) => void;
}

export function ScorePicker({ value, onChange }: ScorePickerProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.min(20, value + 1))}
        disabled={value >= 20}
        className="w-11 h-11 rounded-full bg-[#f4f7fc] hover:bg-[#e8edf8] border border-[#e8ecf2] flex items-center justify-center text-[#4285F4] transition-all disabled:opacity-30 cursor-pointer active:scale-95"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
      </button>
      <span className="text-4xl sm:text-5xl font-bold text-[#1a1a1a] tabular-nums w-14 sm:w-16 text-center leading-none py-1">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value <= 0}
        className="w-11 h-11 rounded-full bg-[#f4f7fc] hover:bg-[#e8edf8] border border-[#e8ecf2] flex items-center justify-center text-[#4285F4] transition-all disabled:opacity-30 cursor-pointer active:scale-95"
      >
        <Minus className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
