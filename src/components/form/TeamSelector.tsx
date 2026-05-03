"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { teams } from "@/lib/teams";
import { FlagImage } from "./FlagImage";

interface TeamSelectorProps {
  value: string;
  onChange: (value: string) => void;
  excludeTeam?: string;
  placeholder: string;
  error?: string;
}

export function TeamSelector({ value, onChange, excludeTeam, placeholder, error }: TeamSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filteredTeams = teams
    .filter((t) => t.code !== excludeTeam)
    .filter((t) => !search || t.name.includes(search));
  const selectedTeam = teams.find((t) => t.code === value);

  return (
    <div>
      <button
        type="button"
        onClick={() => { setOpen(true); setSearch(""); }}
        className={cn(
          "flex w-full items-center justify-between h-12 text-sm rounded-xl border bg-white px-4 py-2 transition-all cursor-pointer",
          "hover:border-[#4285F4]/30",
          value ? "border-[#4285F4]/20" : "border-[#e8ecf2]",
          !value && "text-[#c4c4c8]",
          error && "border-red-400"
        )}
      >
        {selectedTeam ? (
          <span className="flex items-center gap-2.5 text-[#1a1a1a]">
            <FlagImage iso={selectedTeam.iso} size={22} />
            <span className="font-medium">{selectedTeam.name}</span>
          </span>
        ) : (
          <span>{placeholder}</span>
        )}
        <ChevronsUpDown className="h-4 w-4 text-[#c4c4c8]" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm p-0 gap-0" dir="rtl">
          <DialogHeader className="px-4 pt-4 pb-0">
            <DialogTitle className="text-base font-bold text-[#1a1a1a]">בחרו נבחרת</DialogTitle>
          </DialogHeader>

          {/* Search */}
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#c4c4c8]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="חיפוש נבחרת..."
                className="w-full h-10 pr-10 pl-4 text-sm rounded-lg border border-[#e8ecf2] bg-[#f9fafb] text-[#1a1a1a] placeholder:text-[#c4c4c8] focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]/20"
                autoFocus
              />
            </div>
          </div>

          {/* Team list */}
          <div className="max-h-[50vh] overflow-y-auto px-2 pb-3">
            {filteredTeams.length === 0 ? (
              <p className="text-center text-[#a1a1aa] text-sm py-6">לא נמצאה נבחרת</p>
            ) : (
              filteredTeams.map((team) => (
                <button
                  key={team.code}
                  type="button"
                  onClick={() => { onChange(team.code); setOpen(false); }}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer",
                    value === team.code
                      ? "bg-[#4285F4]/5 text-[#4285F4]"
                      : "hover:bg-[#f4f7fc] text-[#1a1a1a]"
                  )}
                >
                  <FlagImage iso={team.iso} size={24} />
                  <span className="font-medium">{team.name}</span>
                  {value === team.code && (
                    <Check className="mr-auto h-4 w-4 text-[#4285F4]" />
                  )}
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
