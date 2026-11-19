export const dynamic = 'force-dynamic';
import { headers } from 'next/headers';
import { getAuth } from '@/lib/auth';
import { sign } from 'jsonwebtoken';

export async function GET() {
  const authInstance = await getAuth();
  const session = await authInstance.api.getSession({ headers: await headers() });

  if (!session || !session.user) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = sign(
    { sub: session.user.id, email: session.user.email, role: session.user.role },
    process.env.JWT_SECRET,
    {
      algorithm: 'HS256',
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
      expiresIn: '1h',
    }
  );

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  return new Response(JSON.stringify({ token, expiresAt }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
