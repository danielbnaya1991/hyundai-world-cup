"use client";

import Image from "next/image";
import { CountdownTimer } from "./CountdownTimer";
import { ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-dvh flex flex-col items-center justify-center bg-white px-4 sm:px-6 pt-10 pb-16 sm:pb-20">
      {/* Campaign Logo */}
      <div className="mb-6 animate-[fadeInUp_0.7s_ease-out]">
        <Image
          src="/logo.png"
          alt="Guess tomorrow's score, get tomorrow's car — Hyundai"
          width={420}
          height={600}
          priority
          className="mx-auto w-[240px] sm:w-[300px] md:w-[360px] h-auto"
        />
      </div>

      {/* Subheadline */}
      <p className="text-[#1a1a1a]/70 text-lg sm:text-xl text-center mb-10 max-w-sm leading-snug font-bold animate-[fadeInUp_0.7s_ease-out_0.1s_both]">
        נחשו איזו נבחרת תזכה בגמר,
        <br />
        ואולי תזכו במכונית של המחר.
      </p>

      {/* Countdown */}
      <div className="mb-12 animate-[fadeInUp_0.7s_ease-out_0.2s_both]">
        <p className="text-[#71717a] text-sm text-center mb-4 tracking-[0.2em] font-medium">
          זמן שנותר לניחוש
        </p>
        <CountdownTimer />
      </div>

      {/* Scroll indicator */}
      <div className="animate-[fadeInUp_0.7s_ease-out_0.4s_both]">
        <ChevronDown className="w-6 h-6 text-[#d4d4d8] animate-bounce" />
      </div>
    </section>
  );
}
