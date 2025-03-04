import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const session = await auth();
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const report = await db.scan.findUnique({
      where: { id, userId: session.user.id },
      select: { pdfData: true },
    });

    if (!report || !report.pdfData) {
      return new Response(JSON.stringify({ error: "Report not found" }), { status: 404 });
    }

    return new Response(report.pdfData, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="report-${id}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Error fetching report:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
