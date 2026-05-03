import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] py-8 sm:py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Image
          src="/logo.png"
          alt="Hyundai World Cup 2026"
          width={80}
          height={40}
          className="mx-auto opacity-30 h-auto w-[60px] invert"
        />
        <p className="text-white/30 text-xs">
          &copy; {new Date().getFullYear()} יונדאי ישראל. כל הזכויות שמורות.
        </p>
        <p className="text-white/30 text-[11px] leading-relaxed max-w-sm mx-auto">
          התקנון המלא מפורסם באתר המבצע. התמונות להמחשה בלבד. ט.ל.ח.
        </p>
      </div>
    </footer>
  );
}
