"use client";

import * as React from "react";

const IMAGES = [
  "/ioniq5-1.jpg",
  "/ioniq5-2.jpg",
  "/ioniq5-3.jpg",
  "/ioniq5-4.jpg",
  "/ioniq5-5.jpg",
];

export function CarCarousel() {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % IMAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "2/1" }}>
        {IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`Hyundai IONIQ 5 — ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === current
                ? "w-7 h-2 bg-white"
                : "w-2 h-2 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`תמונה ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
