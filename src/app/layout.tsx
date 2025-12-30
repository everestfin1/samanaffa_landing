import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navigation from "../components/Navigation";
import Footer from "@/components/Footer";
import { SelectionProvider } from "../lib/selection-context";
import SessionProvider from "@/components/providers/SessionProvider";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import QueryProvider from "@/components/providers/QueryProvider";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Sama Naffa — Épargne Digitale et Emprunt Obligataire",
  description:
    "Plateforme mobile-first pour l'épargne digitale et l'Appel Public à l'Épargne de l'État du Sénégal. Banque moderne, tontines digitales, investissements sécurisés. Conforme BCEAO.",
  keywords:
    "épargne, Épargne Inclusive, Emprunt Obligataire, tontine, investissement, BCEAO, mobile banking",
  authors: [{ name: "Everest Finance SGI" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/fav-samanaffa.png", sizes: "32x32", type: "image/png" },
      { url: "/fav-samanaffa.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/fav-samanaffa.png",
    apple: "/fav-samanaffa.png",
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/sama_naffa_logo.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/sama_naffa_logo.png",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e4bd61",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <head>
        <link
          rel="apple-touch-icon"
          href="/fav-samanaffa.png"
          type="image/<generated>"
          sizes="180x180"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SXLJ8F6H1L"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag(){ window.dataLayer.push(arguments); };
            window.gtag('js', new Date());
            window.gtag('config', 'G-SXLJ8F6H1L');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <QueryProvider>
          <SessionProvider>
            <SelectionProvider>
              <Navigation />
              <WhatsAppButton />
              {children}
              <Footer />
            </SelectionProvider>
          </SessionProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
