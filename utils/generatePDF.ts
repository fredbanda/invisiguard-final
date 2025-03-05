import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function generatePDF(scanResults: any, title: string, fingerprintData: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const { pdfBytes } = fingerprintData;
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const pageSize: [number, number] = [595.2, 841.8]; // A4 size in points
  const margin = 50;
  const fontSize = 12;
  const lineHeight = 14; // Adjust line height if necessary

  const addPageWithText = (text: string, pageNumber: number) => {
    const page = pdfDoc.addPage(pageSize);
    const { height } = page.getSize();
    let textY = height - margin;

    // Add the title to each page
    page.drawText(`${title} - Page ${pageNumber}`, {
      x: margin,
      y: textY,
      size: 24,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    textY -= 40; // Space below the title
    const lines = text.split('\n');

    // biome-ignore lint/complexity/noForEach: <explanation>
    lines.forEach((line) => {
      // If there's no space left on the page, add a new page
      if (textY < margin + fontSize) {
        textY = height - margin; // Reset Y position for the new page
        page.drawText('...content continues...', {
          x: margin,
          y: textY,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0.5, 0.5, 0.5),
        });
        return;
      }

      // Draw the line on the current page
      page.drawText(line, {
        x: margin,
        y: textY,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });

      // Move Y position for the next line
      textY -= lineHeight;
    });
  };

  // Convert scan results to text
  const scanResultText = JSON.stringify(scanResults, null, 2);

  // Determine how many lines can fit on one page
  const linesPerPage = Math.floor((pageSize[1] - 2 * margin) / lineHeight);

  // Split the lines into pages
  const lines = scanResultText.split('\n');
  let pageNumber = 1;

  for (let i = 0; i < lines.length; i += linesPerPage) {
    const pageLines = lines.slice(i, i + linesPerPage).join('\n');
    addPageWithText(pageLines, pageNumber);
    pageNumber++;
  }
return pdfBytes;
}
