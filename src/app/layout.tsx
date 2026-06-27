import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { CartProvider } from "@/components/commerce/CartProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://biply.com"),
  title: {
    default: "Biply | Google yorumlarını tek dokunuşla kolaylaştırın",
    template: "%s | Biply",
  },
  description:
    "Biply, NFC ve QR destekli premium ürünlerle Google yorum, sosyal medya ve WhatsApp aksiyonlarını tek dokunuşla kolaylaştırır.",
  openGraph: {
    title: "Biply | Tek dokunuşla Google yorum akışı",
    description: "Müşteriniz memnun. Yorumu bir dokunuş uzağında.",
    type: "website",
    locale: "tr_TR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
