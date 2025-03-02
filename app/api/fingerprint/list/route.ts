// app/api/fingerprint/list/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    
    // Verify the user is an admin or has permission to view fingerprints
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const fingerprints = await db.userFingerprint.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100 // Limit to recent 100 entries
    });
    console.log(fingerprints);
    
    return NextResponse.json(fingerprints);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}