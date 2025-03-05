// app/api/scans/[id]/pdf/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise < { id: string }> }
) {
  try {
    const scan = await db.scan.findUnique({
      where: { id: (await params).id }
    });

    if (!scan || !scan.pdfData) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    // Return the PDF data
    return new NextResponse(scan.pdfData, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="scan-${scan.id}.pdf"`,
      },
    });
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    console.error('Error retrieving PDF:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}