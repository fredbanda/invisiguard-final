import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: Promise< { id: string }> }) {
  try {
    const { id } = await params;

    // Fetch transaction by ID
    const transaction = await prisma.maxMindTransaction.findUnique({
      where: { id },
      select: { generatedPdf: true }, // Only fetch PDF
    });

    if (!transaction || !transaction.generatedPdf) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
    }

    return new NextResponse(transaction.generatedPdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="transaction-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error fetching PDF:', error);
    return NextResponse.json({ error: 'Failed to retrieve PDF' }, { status: 500 });
  }
}
