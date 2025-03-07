import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateMinFraudReport } from '@/lib/pdf-generator';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise< { id: string }> }
) {
  try {
    const transactionId = (await params).id;
    
    // Get the transaction with PDF bytes
    const transaction = await prisma.maxMindTransaction.findUnique({
      where: { id: transactionId },
      include: { shoppingCartItems: true }
    });
    
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' }, 
        { status: 404 }
      );
    }
    
    // If the PDF doesn't exist, generate it
    let pdfBytes = transaction.generatedPdf;
    if (!pdfBytes) {
      pdfBytes = await generateMinFraudReport(transaction, transaction.id);
      
      // Save the generated PDF to the database
      await prisma.maxMindTransaction.update({
        where: { id: transactionId },
        data: { generatedPdf: pdfBytes },
      });

    }
    
    // Return the PDF as an attachment
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="transaction-${transactionId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error retrieving PDF report:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve PDF report', details: error }, 
      { status: 500 }
    );
  }
}
