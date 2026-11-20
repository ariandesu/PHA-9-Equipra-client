export const dynamic = 'force-dynamic';
import { headers } from 'next/headers';
import { getAuth } from '@/lib/auth';
import { sign, decode } from 'jsonwebtoken';

export async function GET() {
  if (
    !process.env.JWT_SECRET ||
    !process.env.JWT_ISSUER ||
    !process.env.JWT_AUDIENCE
  ) {
    return Response.json(
      { message: 'Token signing is not configured', code: 'TOKEN_MISCONFIGURED' },
      { status: 503 },
    );
  }

  const authInstance = await getAuth();
  const session = await authInstance.api.getSession({ headers: await headers() });

  if (!session || !session.user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
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

  const decoded = decode(token);
  const expiresAt = new Date(Number(decoded?.exp) * 1000).toISOString();

  return Response.json({ token, expiresAt }, {
    status: 200,
    headers: { 'Cache-Control': 'no-store' },
  });
}
