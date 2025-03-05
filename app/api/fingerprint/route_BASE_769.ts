// app/api/fingerprint/route.ts
// biome-ignore lint/style/useImportType: <explanation>
import  { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { auth } from '@/auth';
import type { FingerprintData } from '@/types/fingerprint';

const FINGERPRINT_SECRET_API_KEY = process.env.FINGERPRINT_SECRET_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fingerprintData: FingerprintData = await request.json();
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';

    // Combine client data with server data
    const enhancedData = {
      ...fingerprintData,
      ipAddress: ip
    };

    // Save to database
    const result = await db.userFingerprint.create({
      data: {
        userId: session.user.id,
        visitorId: enhancedData.visitorId,
        browser: enhancedData.browserName,
        os: enhancedData.os,
        device: enhancedData.device,
        screenResolution: enhancedData.screenResolution,
        language: enhancedData.language,
        platform: enhancedData.platform,
        timezone: enhancedData.timezone,
        touchScreen: enhancedData.touchScreen,
        ipAddress: enhancedData.ipAddress,
        incognito: enhancedData.incognito,
        confidenceScore: enhancedData.confidenceScore,
        botProbability: enhancedData.botProbability,
        vpnDetected: enhancedData.vpnDetected
      }
    });

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}