/* eslint-disable @typescript-eslint/no-explicit-any */

import { auth } from "@/auth";
import { db } from "@/lib/db";

<<<<<<< HEAD
export async function GET(req: Request, { params }: { params: Promise< { id: string }> }) {
=======
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
>>>>>>> 85440dc274a0fa7a5846d6e64c96d9ac664279b7
  try {
    const { id } = await params;

    const session = await auth();
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const report = await db.scan.findUnique({
<<<<<<< HEAD
      where: { id: (await params).id, userId: session.user.id },
      select: { pdfData: true }, // Ensure this field exists
=======
      where: { id, userId: session.user.id },
      select: { pdfData: true },
>>>>>>> 85440dc274a0fa7a5846d6e64c96d9ac664279b7
    });

    if (!report || !report.pdfData) {
      return new Response(JSON.stringify({ error: "Report not found" }), { status: 404 });
    }

    return new Response(report.pdfData, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
<<<<<<< HEAD
        "Content-Disposition": `attachment; filename="report-${(await params).id}.pdf"`,
=======
        "Content-Disposition": `attachment; filename="report-${id}.pdf"`,
>>>>>>> 85440dc274a0fa7a5846d6e64c96d9ac664279b7
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
