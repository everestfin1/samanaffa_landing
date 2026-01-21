import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import appCss from "./globals.css?url";
import Navigation from "../components/Navigation";
import Footer from "@/components/Footer";
import { SelectionProvider } from "../lib/selection-context";
import SessionProvider from "@/components/providers/SessionProvider";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import QueryProvider from "@/components/providers/QueryProvider";
import { Analytics } from "@vercel/analytics/react";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "theme-color",
        content: "#e4bd61",
      },
      {
        name: "description",
        content:
          "Plateforme mobile-first pour l'épargne digitale et l'Appel Public à l'Épargne de l'État du Sénégal. Banque moderne, tontines digitales, investissements sécurisés. Conforme BCEAO.",
      },
      {
        name: "keywords",
        content:
          "épargne, Épargne Inclusive, Emprunt Obligataire, tontine, investissement, BCEAO, mobile banking",
      },
      {
        name: "author",
        content: "Everest Finance SGI",
      },
      {
        title: "Sama Naffa — Épargne Digitale et Emprunt Obligataire",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      {
        rel: "icon",
        href: "/fav-samanaffa.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        rel: "icon",
        href: "/fav-samanaffa.png",
        sizes: "16x16",
        type: "image/png",
      },
      { rel: "shortcut icon", href: "/fav-samanaffa.png" },
      { rel: "apple-touch-icon", href: "/fav-samanaffa.png" },
      {
        rel: "android-chrome-192x192",
        href: "/sama_naffa_logo.png",
      },
      {
        rel: "android-chrome-512x512",
        href: "/sama_naffa_logo.png",
      },
    ],
  }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <head>
        <HeadContent />
        <script
          id="google-tag-manager"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-W9GHF4S2');`,
          }}
        />
        <script
          id="facebook-pixel"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2209795136215271');
            fbq('track', 'PageView');`,
          }}
        />
        <noscript>
          <img height="1" width="1" src="https://www.facebook.com/tr?id=2209795136215271&ev=PageView&noscript=1"/>
        </noscript>
      </head>
      <body className="antialiased">
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
              <Outlet />
              <Footer />
            </SelectionProvider>
          </SessionProvider>
        </QueryProvider>
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}
