import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/get-session';

export default async function PortalPage() {
  // Get session server-side
  const session = await getServerSession();

  // Redirect based on authentication status
  if (!session) {
    redirect('/login');
  }

  // User is authenticated, redirect to dashboard
  redirect('/portal/dashboard');
}
