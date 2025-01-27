import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId, emails, domains, phones } = await req.json();
    const seonApiUrl = 'https://api.seon.io/SeonRestService/fraud-api/v2';
    const apiKey = process.env.SEON_API_KEY;

    const payload = {
      config: {
        ip: { include: 'flags,history,id', version: 'v1' },
        email: { include: 'flags,history,id', version: 'v2' },
        phone: { include: 'flags,history,id', version: 'v1' },
        ip_api: true,
        email_api: true,
        phone_api: true,
        device_fingerprinting: true,
      },
      email: emails[0] || '',
      phone_number: phones[0] || '',
    };

    const response = await fetch(seonApiUrl, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey as string,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        `Seon API error: ${responseData.error?.message || response.statusText}`
      );
    }

    // Save scan details to the database
    const scan = await prisma.scan.create({
      data: {
        userId,
        emails,
        phones,
        domains,
        result: responseData,
      },
    });

    return NextResponse.json({ scan }, { status: 200 });
  } catch (error: unknown) {
    console.log(error);
    
    return NextResponse.json({error: "internal server error"}, { status: 500 });
    
    
  }
}

export function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      Allow: 'POST, OPTIONS',
    },
    status: 204,
  });
}
