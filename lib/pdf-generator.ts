import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
// biome-ignore lint/style/useImportType: <explanation>
import { MaxMindTransaction } from '@prisma/client';

export async function generatePdfForTransaction(transaction: MaxMindTransaction): Promise<Buffer> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page to the document
  const page = pdfDoc.addPage();
  
  // Get the standard font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Set some styles
  const fontSize = 12;
  const lineHeight = fontSize * 1.2;
  const margin = 50;
  
  // Set the page dimensions
  const { width, height } = page.getSize();
  
  // Add a title
  page.drawText('MaxMind Transaction Report', {
    x: margin,
    y: height - margin,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // Add transaction ID and date
  page.drawText(`Transaction ID: ${transaction.id}`, {
    x: margin,
    y: height - margin - lineHeight * 2,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(`Date: ${transaction.createdAt.toLocaleString()}`, {
    x: margin,
    y: height - margin - lineHeight * 3,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  
  // Add risk score information
  page.drawText(`Risk Score: ${transaction.riskScore}`, {
    x: margin,
    y: height - margin - lineHeight * 5,
    size: fontSize + 2,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(`IP Address Risk: ${transaction.ipAddressRisk}`, {
    x: margin,
    y: height - margin - lineHeight * 6,
    size: fontSize + 2,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // Draw a line
  page.drawLine({
    start: { x: margin, y: height - margin - lineHeight * 7 },
    end: { x: width - margin, y: height - margin - lineHeight * 7 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  // Transaction details
  let lineCount = 8;
  
  // Account Information
  // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
      page.drawText(`Account Information`, {
    x: margin,
    y: height - margin - lineHeight * lineCount,
    size: fontSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  lineCount += 1;
  page.drawText(`User ID: ${transaction.accountUserId}`, {
    x: margin,
    y: height - margin - lineHeight * lineCount,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  
  lineCount += 1;
  page.drawText(`Username: ${transaction.accountUsername}`, {
    x: margin,
    y: height - margin - lineHeight * lineCount,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  
  lineCount += 2;
  // Billing Information
  // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    page.drawText(`Billing Information`, {
    x: margin,
    y: height - margin - lineHeight * lineCount,
    size: fontSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  lineCount += 1;
  page.drawText(`Name: ${transaction.billingFirstName} ${transaction.billingLastName}`, {
    x: margin,
    y: height - margin - lineHeight * lineCount,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  
  lineCount += 1;
  page.drawText(`Address: ${transaction.billingAddress}`, {
    x: margin,
    y: height - margin - lineHeight * lineCount,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  
  lineCount += 1;
  page.drawText(`City: ${transaction.billingCity}, ${transaction.billingRegion}, ${transaction.billingPostal}`, {
    x: margin,
    y: height - margin - lineHeight * lineCount,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  
  lineCount += 1;
  page.drawText(`Country: ${transaction.billingCountry}`, {
    x: margin,
    y: height - margin - lineHeight * lineCount,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  
  lineCount += 2;
  // Order Information
  // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    page.drawText(`Order Information`, {
    x: margin,
    y: height - margin - lineHeight * lineCount,
    size: fontSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  lineCount += 1;
  page.drawText(`Amount: ${transaction.orderAmount} ${transaction.orderCurrency}`, {
    x: margin,
    y: height - margin - lineHeight * lineCount,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  
  lineCount += 1;
  page.drawText(`Payment Authorized: ${transaction.paymentWasAuthorized ? 'Yes' : 'No'}`, {
    x: margin,
    y: height - margin - lineHeight * lineCount,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  
  // If page is full, add another page
  if (lineCount * lineHeight > height - 2 * margin) {
    const newPage = pdfDoc.addPage();
    const page = newPage;
    lineCount = 2; // Reset line count with some margin
  }
  
  lineCount += 2;
  // Credit Card Information
  // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    page.drawText(`Credit Card Information`, {
    x: margin,
    y: height - margin - lineHeight * lineCount,
    size: fontSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  lineCount += 1;
  page.drawText(`Last Digits: ${transaction.creditCardLastDigits}`, {
    x: margin,
    y: height - margin - lineHeight * lineCount,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  
  lineCount += 1;
  page.drawText(`Issuer ID: ${transaction.creditCardIssuerIdNumber}`, {
    x: margin,
    y: height - margin - lineHeight * lineCount,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  
  lineCount += 1;
  page.drawText(`Bank: ${transaction.creditCardBankName || 'N/A'}`, {
    x: margin,
    y: height - margin - lineHeight * lineCount,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  
  // Convert the PDF to bytes
  const pdfBytes = await pdfDoc.save();
  
  return Buffer.from(pdfBytes);
}

