import { NextResponse } from "next/server";
import { generatePDF } from "@/utils/generatePDF";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const fingerprintData = await req.json();
    console.log("📥Fingerprint data received:", fingerprintData);

    const pdfName = `fingerprint_${Date.now()}.pdf`;

    const  pdfBytes  = await generatePDF(fingerprintData, pdfName, fingerprintData);
    console.log("✅ PDF generated:", pdfBytes);


    // Save to the database
    const fingerprint = await db.userFingerprint.create({
        data: {
            userId: fingerprintData.userId,
            visitorId: fingerprintData.visitorId,
            browser: fingerprintData.browserName,
            os: fingerprintData.os,
            device: fingerprintData.device,
            screenResolution: fingerprintData.screenResolution,
            language: fingerprintData.language,
            platform: fingerprintData.platform,
            timezone: fingerprintData.timezone,
            touchScreen: fingerprintData.touchScreen,
            ipAddress: fingerprintData.ipAddress,
            incognito: fingerprintData.incognito,
            confidenceScore: fingerprintData.confidenceScore,
            botProbability: fingerprintData.botProbability,
            vpnDetected: fingerprintData.vpnDetected,

            pdfData: {
                create: [{ pdfName, pdfBytes }], // ✅ Store PDF name and data separately

            },
        }
        
    })

    return NextResponse.json({ message: "Fingerprint data saved successfully", fingerprint: fingerprint }, { status: 200 });
  } catch (error) {
    console.error("Error saving fingerprint data:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error }, {
         status: 500 }
        );
  }
}
