import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing fingerprint ID" }, { status: 400 });
  }

  const fingerprint = await db.userFingerprint.findUnique({
    where: { id },
    include: { pdfData: true },
  });

  if (!fingerprint || !fingerprint.pdfData.length) {
    return NextResponse.json({ error: "PDF not found" }, { status: 404 });
  }

  const pdfRecord = fingerprint.pdfData[0]; // Assuming single PDF per fingerprint
  const pdfBytes = new Uint8Array(pdfRecord.pdfBytes);

  return new Response(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${pdfRecord.pdfName}"`,
    },
  });
}
