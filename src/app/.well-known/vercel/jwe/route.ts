/** Vercel preview encryption endpoint — not used on self-hosted deployments. */
export function GET() {
  return new Response(null, { status: 404 });
}
