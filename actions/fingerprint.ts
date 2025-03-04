'use server';

import { db } from '@/lib/db'; // Adjust path to your Prisma client
import { auth } from '@/auth'; // Adjust to your NextAuth setup
import type { FingerprintData } from '@/types/fingerprint';


// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function saveFingerprint(fingerprintData: FingerprintData): Promise<any> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }
    
    const userId = session.user.id;
    
    // Check if a fingerprint already exists for this user and visitor
    const existingFingerprint = await db.userFingerprint.findFirst({
      where: {
        userId,
        visitorId: fingerprintData.visitorId
      }
    });
    
    if (existingFingerprint) {
      // Update existing fingerprint
      return await db.userFingerprint.update({
        where: { id: existingFingerprint.id },
        data: {
          visitorId: fingerprintData.visitorId,
          browser: fingerprintData.browserName,
          os: fingerprintData.os,
          device: fingerprintData.device,
          screenResolution: fingerprintData.screenResolution,
          language: fingerprintData.language,
          platform: fingerprintData.platform,
          timezone: fingerprintData.timezone,
          touchScreen: fingerprintData.touchScreen,
          ips: fingerprintData.ipAddress,
          incognito: fingerprintData.incognito,
          confidenceScore: fingerprintData.confidenceScore,
          botProbability: fingerprintData.botProbability,
          vpnDetected: fingerprintData.vpnDetected,
          updatedAt: new Date()
        }
      });
    }
    
    // Create new fingerprint
    return await db.userFingerprint.create({
      data: {
        userId,
        visitorId: fingerprintData.visitorId,
        browser: fingerprintData.browserName,
        os: fingerprintData.os,
        device: fingerprintData.device,
        screenResolution: fingerprintData.screenResolution,
        language: fingerprintData.language,
        platform: fingerprintData.platform,
        timezone: fingerprintData.timezone,
        touchScreen: fingerprintData.touchScreen,
        ips: fingerprintData.ipAddress,
        incognito: fingerprintData.incognito,
        confidenceScore: fingerprintData.confidenceScore,
        botProbability: fingerprintData.botProbability,
        vpnDetected: fingerprintData.vpnDetected
      }
    });
    
  } catch (error) {
    console.error('Error saving fingerprint:', error);
    throw error;
  }
}