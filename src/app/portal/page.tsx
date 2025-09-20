import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';

export default async function PortalPage() {
  // Get session server-side
  const session = await getServerSession(authOptions);

  // Redirect based on authentication status
  if (!session) {
    redirect('/login');
  }

  // User is authenticated, redirect to dashboard
  redirect('/portal/dashboard');
}
