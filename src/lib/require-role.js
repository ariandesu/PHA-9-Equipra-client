import { authClient } from '@/lib/auth-client';
import { redirect } from 'next/navigation';

export async function requireRole(allowedRoles) {
  const session = await authClient.api.getSession({ headers: await headers() });

  if (!session) {
    redirect('/login');
  }

  if (!allowedRoles.includes(session.data.user.role)) {
    redirect('/dashboard');
  }
}
