/* eslint-disable @typescript-eslint/no-explicit-any */

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await auth();
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const report = await db.scan.findUnique({
      where: { id, userId: session.user.id },
      select: { pdfData: true }, // Ensure this field exists
    });

    if (!report || !report.pdfData) {
      return new Response(JSON.stringify({ error: "Report not found" }), {
        status: 404,
      });
    }

    return new Response(report.pdfData, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="report-${id}.pdf"`, // Keeping the correct version
      },
    });
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    console.error("Error fetching report:", error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
