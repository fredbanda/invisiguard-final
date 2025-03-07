import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

export async function generateMinFraudReport(result: any, formData: any) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create()

  // Add a page to the document
  const page = pdfDoc.addPage([595.28, 841.89]) // A4 size

  // Get fonts
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Set page margins
  const margin = 50
  const width = page.getWidth() - 2 * margin

  // Add title
  page.drawText("MinFraud Risk Analysis Report", {
    x: margin,
    y: page.getHeight() - margin,
    size: 18,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  })

  // Add date
  const date = new Date().toLocaleString()
  page.drawText(`Generated on: ${date}`, {
    x: margin,
    y: page.getHeight() - margin - 25,
    size: 10,
    font: helveticaFont,
    color: rgb(0.4, 0.4, 0.4),
  })

  // Add transaction details
  page.drawText("Transaction Details", {
    x: margin,
    y: page.getHeight() - margin - 60,
    size: 14,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  })

  const transactionDetails = [
    `Transaction ID: ${formData.transactionId || "N/A"}`,
    `Amount: ${formData.transactionAmount || "N/A"} ${formData.transactionCurrency || "USD"}`,
    `Type: ${formData.transactionType || "N/A"}`,
    `Shop ID: ${formData.shopId || "N/A"}`,
  ]

  let yPos = page.getHeight() - margin - 85
  transactionDetails.forEach((detail) => {
    page.drawText(detail, {
      x: margin,
      y: yPos,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    })
    yPos -= 15
  })

  // Add risk scores
  page.drawText("Risk Assessment", {
    x: margin,
    y: yPos - 20,
    size: 14,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  })

  yPos -= 45

  const riskScores = [
    `Overall Risk Score: ${result.riskScore.toFixed(1)}`,
    `Fraud Score: ${result.fraudScore.toFixed(1)}`,
    `IP Risk Score: ${result.ipRiskScore.toFixed(1)}`,
  ]

  riskScores.forEach((score) => {
    page.drawText(score, {
      x: margin,
      y: yPos,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    })
    yPos -= 15
  })

  // Add recommendations
  page.drawText("Recommendations", {
    x: margin,
    y: yPos - 20,
    size: 14,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  })

  yPos -= 45

  if (result.recommendations && result.recommendations.length > 0) {
    result.recommendations.forEach((rec: string, index: number) => {
      page.drawText(`${index + 1}. ${rec}`, {
        x: margin,
        y: yPos,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        maxWidth: width,
      })
      yPos -= 15
    })
  } else {
    page.drawText("No recommendations available.", {
      x: margin,
      y: yPos,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    })
    yPos -= 15
  }

  // Add IP insights if available
  if (result.insights && result.insights.ipLocation) {
    page.drawText("IP Location Information", {
      x: margin,
      y: yPos - 20,
      size: 14,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    })

    yPos -= 45

    const ipInfo = [
      `Country: ${result.insights.ipLocation.country || "Unknown"}`,
      `City: ${result.insights.ipLocation.city || "Unknown"}`,
      `ISP: ${result.insights.ipLocation.isp || "Unknown"}`,
    ]

    ipInfo.forEach((info) => {
      page.drawText(info, {
        x: margin,
        y: yPos,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      })
      yPos -= 15
    })
  }

  // Add footer
  page.drawText("This report was generated based on MaxMind minFraud analysis.", {
    x: margin,
    y: margin,
    size: 8,
    font: helveticaFont,
    color: rgb(0.4, 0.4, 0.4),
  })

  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}

