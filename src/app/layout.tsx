import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Hyundai World Cup 2026 | נחשו את התוצאה, זכו ברכב",
  description:
    "נחשו את תוצאת גמר המונדיאל 2026 וזכו ביונדאי IONIQ 5. מבצע יונדאי ישראל.",
  openGraph: {
    title: "Hyundai World Cup 2026 | נחשו את התוצאה, זכו ברכב",
    description:
      "נחשו את תוצאת גמר המונדיאל 2026 וזכו ביונדאי IONIQ 5",
    type: "website",
    locale: "he_IL",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hyundai World Cup 2026",
    description:
      "נחשו את תוצאת גמר המונדיאל 2026 וזכו ביונדאי IONIQ 5",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="h-full antialiased m-0 p-0">
      <body className="min-h-full flex flex-col m-0 p-0 w-full max-w-full">
        {children}
        <Toaster position="top-center" richColors dir="rtl" />
      </body>
    </html>
  );
}
