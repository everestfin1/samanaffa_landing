import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Sama Naffa — Épargne Digitale et APE Sénégal",
  description: "Plateforme mobile-first pour l'épargne digitale et l'Appel Public à l'Épargne de l'État du Sénégal. Banque moderne, tontines digitales, investissements sécurisés. Conforme BCEAO.",
  keywords: "épargne, banque digitale, APE Sénégal, tontine, investissement, BCEAO, mobile banking",
  authors: [{ name: "Everest Finance SGI" }],
  viewport: "width=device-width, initial-scale=1",
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
        {children}
      </body>
    </html>
  );
}
