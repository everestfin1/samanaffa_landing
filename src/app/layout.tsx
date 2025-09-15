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
  title: "Sama Naffa - Épargner pour vos projets, facilement et en toute sécurité",
  description: "Plateforme mobile-first pour l'épargne personnalisée et les investissements APE. Ouvrez un compte en 3 clics maximum avec confirmation immédiate.",
  keywords: "épargne, investissement, APE, mobile money, BCEAO, Sama Naffa",
  authors: [{ name: "Sama Naffa" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Sama Naffa - Épargne et Investissement Simplifié",
    description: "Épargner pour vos projets en toute sécurité avec Sama Naffa. Parcours simplifié en 3 clics.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sama Naffa - Épargne Mobile",
    description: "Plateforme d'épargne digitale sécurisée avec confirmations immédiates",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
