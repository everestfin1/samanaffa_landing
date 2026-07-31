/** Shared Content-Security-Policy — unsafe-eval only in development (Next.js HMR). */
export function buildContentSecurityPolicy(isDev: boolean): string {
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    ...(isDev ? ["'unsafe-eval'"] : []),
    'https://vercel.live',
    'https://touchpay.gutouch.net',
    'https://cdnjs.cloudflare.com',
    'https://www.googletagmanager.com',
    'https://connect.facebook.net',
  ].join(' ');

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "worker-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob: https://www.facebook.com https://cdn.jsdelivr.net",
    "media-src 'self' blob:",
    [
      "connect-src 'self'",
      'https://api.twilio.com',
      'https://api.bulksms.com',
      'https://api.sendgrid.com',
      'https://api.intouch.com',
      'https://touchpay.gutouch.net',
      'https://cdnjs.cloudflare.com',
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://analytics.google.com',
      'https://www.google.com',
      'https://connect.facebook.net',
      'https://www.facebook.com',
    ].join(' '),
    "frame-src 'self' https://vercel.live https://www.googletagmanager.com https://verify.didit.me",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://touchpay.gutouch.net",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ['upgrade-insecure-requests']),
  ];

  return directives.join('; ');
}
