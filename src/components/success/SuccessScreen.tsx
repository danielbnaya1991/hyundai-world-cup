"use client";

import * as React from "react";
import confetti from "canvas-confetti";
import Image from "next/image";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface SuccessScreenProps {
  serialNumber: string;
}

export function SuccessScreen({ serialNumber }: SuccessScreenProps) {
  const [copied, setCopied] = React.useState(false);
  const hasConfettiFired = React.useRef(false);

  React.useEffect(() => {
    if (hasConfettiFired.current) return;
    hasConfettiFired.current = true;

    const duration = 2500;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#4285F4", "#1a1a1a", "#FFD700"] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#4285F4", "#1a1a1a", "#FFD700"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const copySerial = () => {
    navigator.clipboard.writeText(serialNumber);
    setCopied(true);
    toast.success("מספר סידורי הועתק!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="min-h-dvh flex flex-col items-center justify-center bg-white px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-md mx-auto text-center animate-[fadeInUp_0.5s_ease-out]">
        <div className="text-5xl sm:text-6xl mb-6 sm:mb-8">🏆</div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-2">הניחוש נשלח בהצלחה!</h2>
        <p className="text-[#71717a] text-sm sm:text-base mb-8 sm:mb-10">
          שמרו את המספר הסידורי — הוא האישור שלכם
        </p>

        {/* Serial number */}
        <div className="bg-[#f4f7fc] rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8 border border-[#e8ecf2]">
          <p className="text-[#a1a1aa] text-xs tracking-[0.2em] uppercase mb-3">מספר סידורי</p>
          <p className="text-2xl sm:text-4xl font-bold text-[#4285F4] tracking-[0.08em] sm:tracking-[0.12em] font-mono mb-5" dir="ltr">
            {serialNumber}
          </p>
          <button
            onClick={copySerial}
            className="inline-flex items-center gap-2 px-5 py-2 bg-white hover:bg-[#f9fafb] border border-[#e8ecf2] rounded-full text-[#1a1a1a] text-sm transition-all cursor-pointer active:scale-95"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "הועתק!" : "העתק מספר"}
          </button>
        </div>

        {/* Car */}
        <Image
          src="/ioniq5-main.png"
          alt="Hyundai IONIQ 5"
          width={500}
          height={250}
          className="mx-auto mb-6"
        />

        <p className="text-[#c4c4c8] text-sm">
          אם הניחוש שלכם יתגשם — ניצור קשר. בהצלחה!
        </p>
      </div>
    </section>
  );
}
