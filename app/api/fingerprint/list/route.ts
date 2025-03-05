import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET() {
    try{
    const fingerprints = await db.userFingerprint.findMany({
        include: { pdfData: true },
        orderBy: {createdAt: 'desc'}
    });

    console.log("Fetched fingerprints:", fingerprints);
    

    return NextResponse.json({ fingerprints }, { status: 200 });
    } catch (error) {
        console.log("Error fetching fingerprints:", error); 
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        
    }
}