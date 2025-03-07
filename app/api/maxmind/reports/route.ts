import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const transaction = await db.maxMindTransaction.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!transaction) {
      return new NextResponse("Report not found", { status: 404 })
    }

    if (!transaction.generatedPdf) {
      return new NextResponse("PDF not found for this report", { status: 404 })
    }

    // Return the PDF
    return new NextResponse(transaction.generatedPdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="minfraud-report-${transaction.eventTransactionId}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error fetching report:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

