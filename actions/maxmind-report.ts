"use server";

import * as minFraud from "@maxmind/minfraud-api-node";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { generatePDF } from "@/lib/pdfGenerator";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function createReport(formData: any) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    const {
      ipAddress,
      email,
      iin,
      eventTime,
      timezone,
      billingCity,
      billingCountry,
      billingPostalCode,
      billingPhone,
      shippingAddress1,
      shippingAddress2,
      shippingCountry,
      shippingPostalCode,
    } = formData;

    // ✅ Initialize MaxMind Client
    const client = new minFraud.Client(
      process.env.MAXMIND_ACCOUNT_ID!,
      process.env.MAXMIND_LICENSE_KEY!
    );

    // ✅ Format and sanitize request payload
    const formattedRequest = {
      device: { ipAddress },
      email: { address: email },
      creditCard: { issuerIdNumber: iin },
      billing: {
        city: billingCity,
        country: billingCountry,
        postal: billingPostalCode,
        phoneNumber: billingPhone.replace("+", ""), // ✅ Remove "+" from phone
      },
      shipping: {
        address: `${shippingAddress1} ${shippingAddress2}`.trim(), // ✅ Remove extra spaces
        country: shippingCountry,
        postal: shippingPostalCode,
      },
      event: {
        time: eventTime,
        timezone: "Africa/Johannesburg", // ✅ Use IANA timezone format
      },
    };

    console.log("📤 Sending request to MaxMind:", JSON.stringify(formattedRequest, null, 2));

    // ✅ Send request to MaxMind
    const response = await client.insights(formattedRequest);

    console.log("✅ MaxMind Response:", response);

    // ✅ Generate PDF report
    const pdfUrl = await generatePDF({
      email,
      ipAddress,
      response,
      iin,
      eventTime,
      timezone,
      billingCity,
      billingCountry,
      billingPostalCode,
      billingPhone,
      shippingAddress1,
      shippingAddress2,
      shippingCountry,
      shippingPostalCode,
    },

    "Fraud Report",

);

    // ✅ Save report in PostgreSQL via Prisma
    const report = await db.report.create({
      data: {
        userId: session.user.id,
        ipAddress,
        email,
        iin,
        eventTime: new Date(eventTime),
        timezone,
        billingCity,
        billingCountry,
        billingPostalCode,
        billingPhone,
        shippingAddress1,
        shippingAddress2,
        shippingCountry,
        shippingPostalCode,
        riskScore: response.riskScore,
        minFraudData: JSON.stringify(response),
        pdfUrl: pdfUrl,
     
      },
    });

    return report;
  } catch (error: any) {
    console.error("❌ MaxMind API error:", error);

    const errorMessage = error?.error || "Unknown error";
    const errorCode = error?.code || "UNKNOWN_ERROR";
    const errorUrl = error?.url || "No URL provided";

    throw new Error(
      `MaxMind API Error: ${errorMessage} (Code: ${errorCode}). Request URL: ${errorUrl}`
    );
  }
}
