"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { DEADLINE } from "@/lib/constants";

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-[#f4f7fc] rounded-xl sm:rounded-2xl w-[64px] sm:w-[80px] py-3 sm:py-4 mb-1.5">
        <span className="text-[30px] sm:text-[40px] font-bold text-[#1a1a1a] tabular-nums block text-center leading-none">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[#71717a] text-xs sm:text-sm tracking-wide">{label}</span>
    </div>
  );
}

export function CountdownTimer() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(DEADLINE);

  if (isExpired) {
    return (
      <div className="bg-[#f4f7fc] rounded-2xl px-8 py-4 text-center">
        <p className="text-[#1a1a1a] text-lg font-semibold">ההרשמה נסגרה</p>
      </div>
    );
  }

  return (
    <div className="flex flex-row-reverse gap-1 sm:gap-2 justify-center items-start" dir="ltr">
      <TimeUnit value={days} label="ימים" />
      <span className="text-[24px] sm:text-[28px] font-light text-[#d4d4d8] mt-3 sm:mt-4">:</span>
      <TimeUnit value={hours} label="שעות" />
      <span className="text-[24px] sm:text-[28px] font-light text-[#d4d4d8] mt-3 sm:mt-4">:</span>
      <TimeUnit value={minutes} label="דקות" />
      <span className="text-[24px] sm:text-[28px] font-light text-[#d4d4d8] mt-3 sm:mt-4">:</span>
      <TimeUnit value={seconds} label="שניות" />
    </div>
  );
}
