/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const reportId = url.searchParams.get("id");

    if (!reportId) {
      return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
    }

    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the report
    const report = await db.report.findUnique({
      where: {
        id: reportId,
        userId: session.user.id // Security check: ensure report belongs to user
      }
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Generate a fresh PDF based on the stored data
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);
    const { height, width } = page.getSize();
    let y = height - 50;
    const fontSize = 12;
    const lineHeight = 18;

    // Helper function to add text with line wrapping
    const addText = (text: string, size = fontSize, x = 50, indent = 0) => {
      page.drawText(text, { 
        x: x + indent, 
        y, 
        size, 
        maxWidth: width - 100 - indent
      });
      y -= lineHeight;
    };

    // Title
    addText("IPQS Validation Report", 18);
    y -= 10;
    addText(`Generated: ${report.eventTime.toLocaleString()}`, 10);
    addText(`Report ID: ${report.id}`, 10);
    y -= 20;

    // Summary section
    addText("Summary Information:", 14);
    y -= 5;
    addText(`Email: ${report.email}`, fontSize, 50, 10);
    addText(`IP Address: ${report.ipAddress}`, fontSize, 50, 10);
    if (report.riskScore) {
      addText(`Risk Score: ${report.riskScore.toFixed(2)}`, fontSize, 50, 10);
    }
    
    if (report.billingCity || report.billingCountry) {
      addText(`Location: ${[report.billingCity, report.billingCountry].filter(Boolean).join(", ")}`, fontSize, 50, 10);
    }
    
    if (report.timezone) {
      addText(`Timezone: ${report.timezone}`, fontSize, 50, 10);
    }
    
    y -= 20;

    // Detailed results from minFraudData
    addText("Detailed Analysis:", 14);
    y -= 10;
    
    // Format JSON data for readability
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            const minFraudData = report.minFraudData as any;
    
    // Add email results
    if (minFraudData.emailResults && minFraudData.emailResults.length > 0) {
      addText("Email Validation Results:", 13);
      y -= 5;
      
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            minFraudData.emailResults.forEach((result: any, index: number) => {
        addText(`${index + 1}. ${result.email || 'Unknown email'}`, fontSize, 50, 10);
        if (result.fraud_score !== undefined) {
          addText(`   Fraud Score: ${result.fraud_score}`, fontSize - 1, 50, 20);
        }
        if (result.valid !== undefined) {
          addText(`   Valid: ${result.valid ? 'Yes' : 'No'}`, fontSize - 1, 50, 20);
        }
        if (result.disposable !== undefined) {
          addText(`   Disposable: ${result.disposable ? 'Yes' : 'No'}`, fontSize - 1, 50, 20);
        }
        y -= 5;
      });
      
      y -= 10;
    }
    
    // Add IP results
    if (minFraudData.ipResults && minFraudData.ipResults.length > 0) {
      addText("IP Validation Results:", 13);
      y -= 5;
      
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            minFraudData.ipResults.forEach((result: any, index: number) => {
        addText(`${index + 1}. ${result.ip_address || 'Unknown IP'}`, fontSize, 50, 10);
        if (result.fraud_score !== undefined) {
          addText(`   Fraud Score: ${result.fraud_score}`, fontSize - 1, 50, 20);
        }
        if (result.country_code) {
          addText(`   Country: ${result.country_code}`, fontSize - 1, 50, 20);
        }
        if (result.proxy !== undefined) {
          addText(`   Proxy: ${result.proxy ? 'Yes' : 'No'}`, fontSize - 1, 50, 20);
        }
        y -= 5;
      });
    }

    const pdfBytes = await pdfDoc.save();

    // Return PDF as download
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="report-${reportId}.pdf"`
      }
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}

