import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";
import Footer from "@/components/Footer";
import { SelectionProvider } from "../lib/selection-context";
import SessionProvider from "@/components/providers/SessionProvider";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import QueryProvider from "@/components/providers/QueryProvider";
import CookieConsent from "@/components/compliance/CookieConsent";
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
  title: "Sama Naffa — Nous gérons votre épargne | Everest Finance (SGI)",
  description:
    "Sama Naffa : nous plaçons et gérons votre épargne en obligations de l'État, avec un objectif de rendement. Une solution simple d'Everest Finance, société agréée et régulée (CREPMF).",
  keywords:
    "épargne gérée, faire fructifier son épargne, obligations de l'État, investir au Sénégal, Everest Finance, CREPMF",
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
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <QueryProvider>
          <SessionProvider>
            <SelectionProvider>
              <Navigation />
              <WhatsAppButton />
              {children}
              <Footer />
              <CookieConsent />
            </SelectionProvider>
          </SessionProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
