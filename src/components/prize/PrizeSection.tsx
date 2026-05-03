import Image from "next/image";

export function PrizeSection() {
  return (
    <section className="py-16 px-6 bg-[#f9fafb] border-t border-[#f0f1f3]">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-8">
        <div className="flex-1 text-center sm:text-right">
          <p className="text-[#4285F4] text-[10px] tracking-[0.3em] uppercase font-semibold mb-1">Hyundai</p>
          <h3 className="text-2xl font-bold text-[#1a1a1a] mb-3">IONIQ 5</h3>
          <p className="text-[#71717a] text-sm leading-relaxed">
            רכב ה-SUV החשמלי עטור הפרסים של יונדאי.
            טכנולוגיה מתקדמת, עיצוב אייקוני, טווח נסיעה של עד 570 ק&quot;מ
            וטעינה מהירה ב-18 דקות בלבד.
            החל מ-₪214,990.
          </p>
        </div>
        <div className="flex-1">
          <Image
            src="/ioniq5-side.jpg"
            alt="Hyundai IONIQ 5"
            width={600}
            height={400}
            className="w-full rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}
