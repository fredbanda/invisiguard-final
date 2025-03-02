import { NextResponse } from "next/server";
import { PDFDocument, rgb } from "pdf-lib";
import { db } from "@/lib/db";
import { auth } from "@/auth";

const IPQS_API_KEY = process.env.IPQS_API_KEY;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { emails, phones, ips, domains, visitorId } = await req.json();
    const userId = session.user.id;

    if (!emails && !phones && !ips && !domains) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    // Function to fetch data from IPQS
    const fetchIPQS = async (type: string, value: string) => {
      const url = `https://www.ipqualityscore.com/api/json/${type}/${IPQS_API_KEY}/${value}`;
      const res = await fetch(url);
      return res.json();
    };

    // Process each type of input
    const emailResults = emails ? await Promise.all(emails.map((email: string) => fetchIPQS("email", email))) : [];
    const phoneResults = phones ? await Promise.all(phones.map((phone: string) => fetchIPQS("phone", phone))) : [];
    const ipResults = ips ? await Promise.all(ips.map((ip: string) => fetchIPQS("ip", ip))) : [];
    const domainResults = domains ? await Promise.all(domains.map((domain: string) => fetchIPQS("url", domain))) : [];

    console.log("IPQS Results:", emailResults, phoneResults, ipResults, domainResults);

    // Extract relevant data for the database
    const primaryEmail = emails && emails.length > 0 ? emails[0] : "";
    const primaryIp = ips && ips.length > 0 ? ips[0] : "";
    
    // Calculate risk score (average of all fraud scores)
    let totalScore = 0;
    let scoreCount = 0;
    
    // biome-ignore lint/complexity/noForEach: <explanation>
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                emailResults.forEach((result: any) => {
      if (result.fraud_score) {
        totalScore += result.fraud_score;
        scoreCount++;
      }
    });
    
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        // biome-ignore lint/complexity/noForEach: <explanation>
                phoneResults.forEach((result: any) => {
      if (result.fraud_score) {
        totalScore += result.fraud_score;
        scoreCount++;
      }
    });
    
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        // biome-ignore lint/complexity/noForEach: <explanation>
                ipResults.forEach((result: any) => {
      if (result.fraud_score) {
        totalScore += result.fraud_score;
        scoreCount++;
      }
    });
    
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        // biome-ignore lint/complexity/noForEach: <explanation>
                domainResults.forEach((result: any) => {
      if (result.risk_score) {
        totalScore += result.risk_score;
        scoreCount++;
      }
    });

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    // biome-ignore lint/complexity/noForEach: <explanation>
        ipResults.forEach((result: any) => {
      if (result.risk_score) {
        totalScore += result.risk_score;
        scoreCount++;
      }
    });
    
    const averageRiskScore = scoreCount > 0 ? totalScore / scoreCount : null;

    // Generate PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Standard letter size
    const { height, width } = page.getSize();
    let y = height - 50;
    const fontSize = 12;
    const lineHeight = 18;

    // Helper function to add text with line wrapping
    const addText = (text: string, size = fontSize, color = rgb(0, 0, 0), indent = 0) => {
      page.drawText(text, { 
        x: 50 + indent, 
        y, 
        size, 
        color,
        maxWidth: width - 100 - indent
      });
      y -= lineHeight;
    };

    // Title
    addText("IPQS Validation Report", 18, rgb(0, 0, 0));
    y -= 10;
    addText(`Generated: ${new Date().toLocaleString()}`, 10, rgb(0.5, 0.5, 0.5));
    y -= 10;

    // Summary section
    addText("Summary:", 14, rgb(0, 0, 0.8));
    if (averageRiskScore !== null) {
      addText(`Overall Risk Score: ${averageRiskScore.toFixed(2)}`, fontSize, rgb(0, 0, 0), 10);
    }
    if (primaryEmail) {
      addText(`Primary Email: ${primaryEmail}`, fontSize, rgb(0, 0, 0), 10);
    }
    if (primaryIp) {
      addText(`IP Address: ${primaryIp}`, fontSize, rgb(0, 0, 0), 10);
    }
    y -= 10;

    // Add results sections
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    // biome-ignore lint/complexity/noForEach: <explanation>
    const addResultsSection = (title: string, results: any[], type: string) => {
      if (results.length === 0) return;
      
      addText(title, 14, rgb(0, 0, 0.8));
      y -= 5;
      
      results.forEach((result, index) => {
        let valueCheck = '';
        
        switch(type) {
          case 'email':
            valueCheck = result.valid ? 'Valid' : 'Invalid';
            addText(`${index + 1}. ${result.email || 'Unknown email'} - ${valueCheck}`, fontSize, rgb(0, 0, 0), 10);
            addText(`   Fraud Score: ${result.fraud_score || 'N/A'}`, fontSize - 2, rgb(0.3, 0.3, 0.3), 20);
            if (result.disposable) addText("   Disposable Email", fontSize - 2, rgb(0.7, 0, 0), 20);
            break;
            
          case 'phone':
            valueCheck = result.valid ? 'Valid' : 'Invalid';
            addText(`${index + 1}. ${result.phone || 'Unknown number'} - ${valueCheck}`, fontSize, rgb(0, 0, 0), 10);
            addText(`   Fraud Score: ${result.fraud_score || 'N/A'}`, fontSize - 2, rgb(0.3, 0.3, 0.3), 20);
            if (result.active) addText("   Active Service", fontSize - 2, rgb(0, 0.7, 0), 20);
            break;
            
          case 'ip':
            addText(`${index + 1}. ${result.ip_address || result.host || 'Unknown IP'}`, fontSize, rgb(0, 0, 0), 10);
            addText(`   Fraud Score: ${result.fraud_score || 'N/A'}`, fontSize - 2, rgb(0.3, 0.3, 0.3), 20);
            // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
            if (result.proxy) addText(`   Proxy Detected`, fontSize - 2, rgb(0.7, 0, 0), 20);
            break;
            
          case 'domain':
            addText(`${index + 1}. ${result.domain || 'Unknown domain'}`, fontSize, rgb(0, 0, 0), 10);
            addText(`   Risk Score: ${result.risk_score || 'N/A'}`, fontSize - 2, rgb(0.3, 0.3, 0.3), 20);
            if (result.suspicious) addText("   Suspicious Domain", fontSize - 2, rgb(0.7, 0, 0), 20);
            break;
        }
        
        y -= 5;
      });
      
      y -= 10;
    };

    addResultsSection("Email Validation Results", emailResults, 'email');
    addResultsSection("Phone Validation Results", phoneResults, 'phone');
    addResultsSection("IP Validation Results", ipResults, 'ip');
    addResultsSection("Domain Validation Results", domainResults, 'domain');
    addResultsSection("IP Address", ips, 'ip');

    const pdfBytes = await pdfDoc.save();

    // Extract geolocation data from IP check if available
    const ipData = ipResults.length > 0 ? ipResults[0] : null;
    
    // Create report in database
    const scan = await db.scan.create({
      data: {
        userId,
        emails: emails || [],
        ips: ips || [],
        phones: phones || [],
        domains: domains || [],
        result: `Risk Score: ${averageRiskScore ? averageRiskScore.toFixed(2) : 'N/A'}`,
        pdfData: pdfBytes, // Store the PDF directly in the database
        createdAt: new Date()
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      scanId: scan.id,
      riskScore: averageRiskScore 
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}