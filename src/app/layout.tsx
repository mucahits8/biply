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
    "Biply, NFC odaklı Stand, Square ve Round ürünleriyle Google yorum ekranınızı müşterinin tek dokunuşuyla açar.",
  openGraph: {
    title: "Biply | Tek dokunuşla Google yorum akışı",
    description: "QR yok. Uygulama yok. Sadece dokundur.",
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
