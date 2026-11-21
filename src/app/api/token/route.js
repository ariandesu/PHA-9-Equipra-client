import { headers } from 'next/headers';
import { getAuth, resetAuth } from '@/lib/auth';
import { isMongoConnectionError } from '@/lib/auth-cache';
import { sign, decode } from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function GET() {
  let session;
  try {
    const authInstance = await getAuth();
    session = await authInstance.api.getSession({ headers: await headers() });
  } catch (error) {
    // Drop a closed/failed topology so the next request reconnects, and answer
    // 503 rather than letting a database failure look like a plain 401.
    if (isMongoConnectionError(error)) resetAuth();
    return Response.json({ message: 'Authentication request failed' }, { status: 503 });
  }

  // Anonymous visitors always get 401, even if signing isn't configured.
  if (!session || !session.user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Only signed-in users need signing config.
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
