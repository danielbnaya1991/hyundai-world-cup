"use client";

import { cn } from "@/lib/utils";
import type { Team } from "@/lib/teams";

interface TeamCardProps {
  team: Team;
  selected: boolean;
  onClick: () => void;
}

export function TeamCard({ team, selected, onClick }: TeamCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer text-right w-full",
        selected
          ? "bg-[#4285F4]/10 border-[#4285F4] ring-1 ring-[#4285F4]/30 scale-[1.02]"
          : "bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/8"
      )}
    >
      <span className="text-2xl">{team.flag}</span>
      <span className={cn("text-sm font-medium", selected ? "text-[#4285F4]" : "text-white/80")}>
        {team.name}
      </span>
      {selected && (
        <div className="mr-auto w-5 h-5 rounded-full bg-[#4285F4] flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}
