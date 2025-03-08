import { NextResponse } from "next/server";
import { generatePDF } from "@/utils/generatePDF";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    // Make sure the request has content before trying to parse it
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json({ message: "Content-Type must be application/json" }, { status: 400 });
    }

    // Check if request body exists and has content
    const text = await req.text();
    if (!text) {
      return NextResponse.json({ message: "Request body is empty" }, { status: 400 });
    }

    // Parse the JSON manually after confirming we have content
    let fingerprintData;
    try {
      fingerprintData = JSON.parse(text);
    } catch (jsonError) {
      return NextResponse.json({ message: "Invalid JSON in request body", error: String(jsonError) }, { status: 400 });
    }

    console.log("📥Fingerprint data received:", fingerprintData);

    const pdfName = `fingerprint_${Date.now()}.pdf`;
    const pdfBytes = await generatePDF(fingerprintData, pdfName, fingerprintData);
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
        ips: fingerprintData.ipAddress,
        incognito: fingerprintData.incognito,
        confidenceScore: fingerprintData.confidenceScore,
        botProbability: fingerprintData.botProbability,
        vpnDetected: fingerprintData.vpnDetected,
        pdfData: {
          create: [{ pdfName, pdfBytes }], // ✅ Store PDF name and data separately
        },
      }
    });

    return NextResponse.json(
      { 
        message: "Fingerprint data saved successfully", 
        fingerprint: fingerprint 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving fingerprint data:", error);
    return NextResponse.json(
      { 
        message: "Internal Server Error", 
        error: String(error) 
      }, 
      { status: 500 }
    );
  }
}