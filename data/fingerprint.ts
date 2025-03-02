import { db } from "@/lib/db";
import type { FingerprintData } from "@/next-auth";


export async function getFingerprintData(visitorId: string): Promise<FingerprintData | null> {
    try {
        const fingerprintData = await db.userFingerprint.findFirst({
            where: {
                visitorId: visitorId,
            }
        });

        if (!fingerprintData) return null;

        return {
            visitorId: fingerprintData.visitorId,
            ip: fingerprintData.ipAddress || "",
            country: "Unknown", // Adjust as needed
            city: "Unknown",    // Adjust as needed
            isp: "Unknown",     // Adjust as needed
            vpnOrProxy: fingerprintData.vpnDetected,
            botProbability: fingerprintData.botProbability,
            confidenceScore: fingerprintData.confidenceScore,
            fraudScore: 0,      // Adjust as needed
            browser: fingerprintData.browser || "",
            os: fingerprintData.os || "",
            device: fingerprintData.device || "",
            lastUpdated: fingerprintData.updatedAt
        };
    } catch (error) {
        console.error("Error fetching fingerprint data:", error);
        return null;
    }
}
