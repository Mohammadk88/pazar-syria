import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/HeaderModern";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/providers/SessionProvider";
import { ToastProvider } from "@/components/ui/toast";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  display: 'swap',
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "بازار سوريا - أكبر منصة إعلانات مبوبة في سوريا",
  description: "منصة بازار سوريا للإعلانات المبوبة - ابحث عن العقارات والسيارات والخدمات في سوريا",
  keywords: "إعلانات مبوبة، سوريا، عقارات، سيارات، خدمات، بيع، شراء، إيجار",
  authors: [{ name: "PazarSY Team" }],
  robots: "index, follow",
  openGraph: {
    title: "بازار سوريا - أكبر منصة إعلانات مبوبة في سوريا",
    description: "منصة بازار سوريا للإعلانات المبوبة - ابحث عن العقارات والسيارات والخدمات في سوريا",
    type: "website",
    locale: "ar_SY",
    siteName: "بازار سوريا",
  },
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} ${inter.variable} font-cairo antialiased`}>
        <Providers>
          <ToastProvider>
            <Header />
            <main className="min-h-screen pt-20">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
