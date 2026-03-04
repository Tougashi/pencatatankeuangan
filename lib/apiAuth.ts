import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

/**
 * Validates the X-API-Key header.
 * Accepts:
 *   1. The DEFAULT_API_KEY from .env.local (used by the web UI without login)
 *   2. A per-user apiKey stored in the users collection (generated on login)
 */
export async function validateApiKey(
  request: NextRequest
): Promise<NextResponse | null> {
  const apiKey = request.headers.get('X-API-Key');

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Unauthorized: missing API key' },
      { status: 401 }
    );
  }

  // 1. Accept the default key (web UI)
  if (apiKey === process.env.DEFAULT_API_KEY) {
    return null;
  }

  // 2. Accept a user-generated key (login flow)
  const db = await getDatabase();
  const user = await db.collection('users').findOne({ apiKey });

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized: invalid API key' },
      { status: 401 }
    );
  }

  return null;
}
