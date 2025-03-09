/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/auth"; // NextAuth authentication
import { db } from "@/lib/db"; // db Client

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.id;

    // 🔹 Fetch all reports for the logged-in user
    const reports = await db.scan.findMany({
      where: { userId },
      select: {
        id: true,
        createdAt: true,
        result: true,
        pdfUrl: true, // ✅ Make sure this is in your schema
      },
      orderBy: { createdAt: "desc" },
    });

    return new Response(JSON.stringify(reports), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    console.error("Error fetching reports:", error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
