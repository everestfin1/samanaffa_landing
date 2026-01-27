import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import * as React from 'react'
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
  errorComponent: RootErrorComponent,
  notFoundComponent: NotFound,
});

function RootErrorComponent(props: { error: unknown }) {
  const error = props.error
  const isDev = import.meta.env.DEV

  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'Une erreur inattendue est survenue.'

  const stack = error instanceof Error ? error.stack : undefined

  const [showDetails, setShowDetails] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const copyDetails = async () => {
    if (!isDev) return

    const text = stack ?? String(error)

    if (typeof navigator === 'undefined' || !navigator.clipboard) return

    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const reload = () => {
    if (typeof window === 'undefined') return
    window.location.reload()
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Erreur</h1>
      <p className="mt-2 text-sm text-gray-700">{message}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reload}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
        >
          Recharger
        </button>

        {isDev ? (
          <>
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              {showDetails ? 'Masquer les détails' : 'Afficher les détails'}
            </button>
            <button
              type="button"
              onClick={copyDetails}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              {copied ? 'Copié' : 'Copier la stack trace'}
            </button>
          </>
        ) : null}
      </div>

      {isDev && showDetails ? (
        <pre className="mt-6 overflow-auto rounded-md bg-gray-50 p-4 text-xs text-gray-900">
          {stack ?? String(error)}
        </pre>
      ) : null}
    </div>
  )
}

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
