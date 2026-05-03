"use client";

import * as React from "react";
import { Hero } from "@/components/hero/Hero";
import { PredictionForm } from "@/components/form/PredictionForm";
import { SuccessScreen } from "@/components/success/SuccessScreen";
import { Footer } from "@/components/footer/Footer";

export default function HomePage() {
  const [serialNumber, setSerialNumber] = React.useState<string | null>(null);

  const handleSuccess = (serial: string) => {
    setSerialNumber(serial);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (serialNumber) {
    return (
      <main className="flex-1">
        <SuccessScreen serialNumber={serialNumber} />
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex-1">
      <Hero />
      <PredictionForm onSuccess={handleSuccess} />
      <Footer />
    </main>
  );
}
