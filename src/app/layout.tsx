import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from '../components/Navigation';
import Footer from "@/components/Footer";
import { SelectionProvider } from '../lib/selection-context';
import SessionProvider from '@/components/providers/SessionProvider';
import { WhatsAppButton } from "@/components/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sama Naffa — Épargne Digitale et Emprunt Obligataire",
  description: "Plateforme mobile-first pour l'épargne digitale et l'Appel Public à l'Épargne de l'État du Sénégal. Banque moderne, tontines digitales, investissements sécurisés. Conforme BCEAO.",
  keywords: "épargne, Épargne Inclusive, Emprunt Obligataire, tontine, investissement, BCEAO, mobile banking",
  authors: [{ name: "Everest Finance SGI" }],
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
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <SelectionProvider>
            <Navigation />
            <WhatsAppButton />
            {children}
            <Footer />
          </SelectionProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
