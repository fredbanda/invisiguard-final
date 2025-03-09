/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const report = await db.scan.findUnique({
      where: { id: (await params).id },
    });
    if (!report) return new Response("Not Found", { status: 404 });

    return new Response(report.pdfData, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="fraud-report.pdf"`,
      },
    });
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error }), { status: 500 });
  } finally {
    // biome-ignore lint/correctness/noUnsafeFinally: <explanation>
    return new Response("Success");
  }
}
