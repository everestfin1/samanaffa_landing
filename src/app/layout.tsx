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
import ConsentGatedAnalytics from "@/components/compliance/ConsentGatedAnalytics";
import PwaRegister from "@/components/PwaRegister";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  applicationName: "Sama Naffa",
  title: "Sama Naffa — Nous gérons votre épargne | Everest Finance (SGI)",
  description:
    "Sama Naffa : nous plaçons et gérons votre épargne en obligations de l'État, avec un objectif de rendement. Une solution simple d'Everest Finance, société agréée et régulée (CREPMF).",
  keywords:
    "épargne gérée, faire fructifier son épargne, obligations de l'État, investir au Sénégal, Everest Finance, CREPMF",
  authors: [{ name: "Everest Finance SGI" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sama Naffa",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/fav-samanaffa.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/fav-samanaffa.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      {
        url: "/icons/apple-touch-icon-167x167.png",
        sizes: "167x167",
        type: "image/png",
      },
      {
        url: "/icons/apple-touch-icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
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
        {/* iOS Safari fetches /apple-touch-icon.png at the site root by default */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link
          rel="apple-touch-icon-precomposed"
          href="/apple-touch-icon.png"
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
        <ConsentGatedAnalytics />
        <PwaRegister />
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
