import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import appCss from "./globals.css?url";
import Navigation from "../components/Navigation";
import Footer from "@/components/Footer";
import { SelectionProvider } from "../lib/selection-context";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import QueryProvider from "@/components/providers/QueryProvider";
import AdminShell from "@/components/admin/layout/AdminShell";

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    const pathname = location.pathname

    console.log('[ROOT beforeLoad] Pathname:', pathname)

    const MAINTENANCE_MODE =
      (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true') ||
      import.meta.env.VITE_MAINTENANCE_MODE === 'true' ||
      import.meta.env.VITE_PUBLIC_MAINTENANCE_MODE === 'true'

    console.log('[ROOT beforeLoad] Maintenance mode:', MAINTENANCE_MODE)

    if (MAINTENANCE_MODE) {
      const isStaticAsset =
        pathname.startsWith('/_build/') ||
        pathname.startsWith('/static/') ||
        /\.(png|jpg|jpeg|gif|svg|ico|css|js|json|webmanifest)$/.test(pathname)

      const isAllowedRoute =
        pathname.startsWith('/admin') ||
        pathname.startsWith('/pee') ||
        pathname.startsWith('/ape') ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/forgot-password') ||
        pathname.startsWith('/souscrire-ape') ||
        pathname === '/manifest.json'

      if (!isStaticAsset && !isAllowedRoute) {
        throw redirect({ to: '/pee' })
      }
    }

    if (pathname.startsWith('/portal') && typeof document !== 'undefined') {
      const hasSession = document.cookie.includes('better-auth.session_token=')
      console.log('[ROOT beforeLoad] Portal route. Has session:', hasSession)
      if (!hasSession) {
        console.log('[ROOT beforeLoad] No session, redirecting to /login')
        throw redirect({ to: '/login' })
      }
    }
  },
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
  const isAdminShellRoute = isAdminRoute && pathname !== '/admin/login';

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
                  {isAdminShellRoute ? (
                    <AdminShell>
                      <Outlet />
                    </AdminShell>
                  ) : (
                    <Outlet />
                  )}
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
