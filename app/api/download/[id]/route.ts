import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise< { id: string } >}) {
  try {
    const report = await db.scan.findUnique({
        where: { id: (await params).id },
    });
    if(!report){
        return NextResponse.json({error: "Report not found"}, {status: 404});
    }
    // Convert binary data to a downloadable PDF response
    return new Response(report.pdfData, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=IPQS_Report_${await (await params).id}.pdf`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }finally{
    // biome-ignore lint/correctness/noUnsafeFinally: <explanation>
    return NextResponse.json({message: "Download successful"});
  }
}
