import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import appCss from "./globals.css?url";
import adminCss from "./admin/admin.css?url";
import Navigation from "../components/Navigation";
import Footer from "@/components/Footer";
import { SelectionProvider } from "../lib/selection-context";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import QueryProvider from "@/components/providers/QueryProvider";

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
          "Plateforme mobile-first pour l'épargne digitale et l'Appel Public à l'Épargne de l'État du Sénégal.",
      },
      { title: "Sama Naffa — Épargne Digitale et Emprunt Obligataire" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: adminCss },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "icon", href: "/fav-samanaffa.png", sizes: "32x32", type: "image/png" },
      { rel: "apple-touch-icon", href: "/fav-samanaffa.png" },
    ],
  }),
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <QueryProvider>
          <AuthProvider>
            <SelectionProvider>
              {isAdminRoute ? (
                <div className="admin-root">
                  <Outlet />
                </div>
              ) : (
                <>
                  <Navigation />
                  <WhatsAppButton />
                  <Outlet />
                  <Footer />
                </>
              )}
            </SelectionProvider>
          </AuthProvider>
        </QueryProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Page introuvable</h1>
      <p className="mt-2 text-sm text-gray-600">
        La page que vous cherchez n’existe pas ou a été déplacée.
      </p>
    </div>
  );
}
