/* eslint-disable @typescript-eslint/no-explicit-any */

// biome-ignore lint/style/useImportType: <explanation>
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generatePDF } from '@/utils/generatePDF';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { emails, domains, phones, userId } = body;
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    const seonApiUrl = 'https://api.seon.io/SeonRestService/fraud-api/v2';
    const apiKey = process.env.SEON_API_KEY;

    // Define the payload according to Seon's API documentation
    const payload = {
      config: {
        ip: { include: 'flags,history,id', version: 'v1' },
        email: { include: 'flags,history,id', version: 'v2' },
        phone: { include: 'flags,history,id', version: 'v1' },
        domain_api: true,
        ip_api: true,
        email_api: true,
        phone_api: true,
        device_fingerprinting: true,
      },
      email: emails[0] || '',
      phone_number: phones[0] || '',
      // The domain might need to be extracted from the email instead
      // or passed in a different way according to SEON's API
    };

    // If we have a domain, let's extract it from the email or use the first domain
    // if (emails && emails.length > 0 && emails[0]) {
    //   // The domain is likely already extracted in your frontend
    //   // If not, we can use the domains array directly
    //   payload.domain_name = domains[0] || '';
    // }

    console.log('Payload:', payload);

    const response = await fetch(seonApiUrl, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey as string,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    console.log('API Response:', responseData);

    if (!response.ok) {
      console.error('Seon API error:', responseData);
      throw new Error(`Seon API error: ${responseData.error?.message || response.statusText}`);
    }

    // Generate a summary of the scan result
    const resultSummary = JSON.stringify({
      score: responseData.data?.score || 0,
      recommendation: responseData.data?.recommendation || 'No recommendation',
      timestamp: new Date().toISOString()
    });

    // Generate PDF
    const pdfBytes = await generatePDF(responseData, 'SEON Scan Results', resultSummary);
    
    // Save to database
    const scan = await db.scan.create({
      data: {
        userId,
        emails,
        phones,
        domains,
        result: resultSummary,
        pdfData: Buffer.from(pdfBytes),
        createdAt: new Date()
      }
    });

    // Return success response with scan ID
    return NextResponse.json({ 
      success: true, 
      scanId: scan.id,
      message: "Scan completed and saved to database"
    });
    
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (error: any) {
    console.error('Internal Server Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}