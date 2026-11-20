"use server";

import { headers } from 'next/headers';
import { getAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect('/login?redirect=/dashboard');
  }

  return (
    <main className="flex-1 bg-background p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted mt-2">
        Welcome, {session.user.name} ({session.user.role})
      </p>
    </main>
  );
}
