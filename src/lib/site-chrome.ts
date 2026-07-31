/** Routes that use the E0 marketing header/footer (hide legacy chrome). */
const E0_MARKETING_EXACT = new Set([
  '/',
  '/sama-naffa',
  '/onboarding',
  '/login',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',
  '/cookies',
]);

const E0_MARKETING_PREFIXES = ['/sama-naffa/', '/onboarding/'];

/** Product landings with their own header/footer. */
const PRODUCT_LANDING_EXACT = new Set(['/apesenegal', '/pee', '/ape']);

export function usesE0MarketingChrome(pathname: string): boolean {
  if (E0_MARKETING_EXACT.has(pathname)) return true;
  return E0_MARKETING_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/** Pages that receive E0 chrome from the (marketing) layout (not self-wrapped). */
export function usesE0LayoutChrome(pathname: string): boolean {
  return (
    pathname === '/login' ||
    pathname === '/contact' ||
    pathname === '/faq' ||
    pathname === '/privacy' ||
    pathname === '/terms' ||
    pathname === '/cookies'
  );
}

export function isProductLanding(pathname: string): boolean {
  return PRODUCT_LANDING_EXACT.has(pathname);
}

export function isProductRoute(pathname: string): boolean {
  return (
    pathname.startsWith('/apesenegal') ||
    pathname.startsWith('/ape') ||
    pathname.startsWith('/pee')
  );
}

export function shouldHideLegacyNavigation(pathname: string): boolean {
  if (usesE0MarketingChrome(pathname)) return true;
  if (pathname.startsWith('/portal')) return true;
  if (pathname === '/maintenance') return true;
  if (isProductRoute(pathname)) return true;
  if (pathname.startsWith('/admin')) {
    return !pathname.includes('/login');
  }
  return false;
}

export function shouldHideLegacyFooter(pathname: string): boolean {
  if (usesE0MarketingChrome(pathname)) return true;
  if (pathname.startsWith('/portal')) return true;
  if (pathname === '/maintenance') return true;
  if (isProductLanding(pathname) || isProductRoute(pathname)) return true;
  if (pathname.startsWith('/admin')) return true;
  return false;
}

export function shouldHideWhatsApp(pathname: string): boolean {
  return (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/portal') ||
    pathname === '/maintenance'
  );
}
