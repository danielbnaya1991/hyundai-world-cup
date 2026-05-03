"use client";

import { teams } from "@/lib/teams";
import { FlagImage } from "./FlagImage";

interface LiveScoreboardProps {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
}

export function LiveScoreboard({ teamA, teamB, scoreA, scoreB }: LiveScoreboardProps) {
  const a = teams.find((t) => t.code === teamA);
  const b = teams.find((t) => t.code === teamB);
  const hasTeams = a && b;

  return (
    <div className="bg-gradient-to-b from-[#111827] to-[#0a101a] rounded-2xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.12)]">
      {/* Header */}
      <p className="text-[#4285F4] text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-center mb-4 font-semibold">
        FIFA World Cup 2026 · Final
      </p>

      <div className="flex items-center justify-center gap-3 sm:gap-6">
        {/* Team A (right side in RTL) */}
        <div className="flex-1 text-center min-w-0">
          <div className={`flex justify-center mb-1.5 transition-all duration-300 ${a ? "" : "opacity-20"}`}>
            {a ? (
              <FlagImage iso={a.iso} size={36} className="shadow-md" />
            ) : (
              <div className="w-9 h-7 rounded-[3px] bg-white/10" />
            )}
          </div>
          <p className={`text-xs sm:text-sm font-bold truncate transition-colors duration-300 ${a ? "text-white" : "text-white/20"}`}>
            {a?.name || "—"}
          </p>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4">
          <span className={`text-4xl sm:text-5xl font-black tabular-nums transition-colors duration-300 ${hasTeams ? "text-white" : "text-white/15"}`}>
            {scoreA}
          </span>
          <span className="text-3xl sm:text-4xl text-white/60 font-light">:</span>
          <span className={`text-4xl sm:text-5xl font-black tabular-nums transition-colors duration-300 ${hasTeams ? "text-white" : "text-white/15"}`}>
            {scoreB}
          </span>
        </div>

        {/* Team B */}
        <div className="flex-1 text-center min-w-0">
          <div className={`flex justify-center mb-1.5 transition-all duration-300 ${b ? "" : "opacity-20"}`}>
            {b ? (
              <FlagImage iso={b.iso} size={36} className="shadow-md" />
            ) : (
              <div className="w-9 h-7 rounded-[3px] bg-white/10" />
            )}
          </div>
          <p className={`text-xs sm:text-sm font-bold truncate transition-colors duration-300 ${b ? "text-white" : "text-white/20"}`}>
            {b?.name || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
