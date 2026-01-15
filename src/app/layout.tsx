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
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-W9GHF4S2');`}
        </Script>
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2209795136215271');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" src="https://www.facebook.com/tr?id=2209795136215271&ev=PageView&noscript=1"/>
        </noscript>
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-W9GHF4S2" 
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
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
