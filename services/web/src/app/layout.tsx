import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/layout/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "ToMoola — Book Authentic Folk Artists",
  description:
    "Discover and book Karnataka's finest folk performers for your events. Verified artists, secure payments, unforgettable experiences.",
  keywords: [
    "folk dance",
    "folk artists",
    "Karnataka",
    "book artists",
    "cultural events",
    "Indian folk dance",
    "ToMoola",
  ],
  openGraph: {
    title: "ToMoola — Book Authentic Folk Artists",
    description:
      "Discover and book Karnataka's finest folk performers for your events. Verified artists, secure payments, unforgettable experiences.",
    siteName: "ToMoola",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
