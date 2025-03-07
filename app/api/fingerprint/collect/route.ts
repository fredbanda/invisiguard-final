import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {auth} from "@/auth";

export async function POST(req: Request) {
  try {

    const session = await auth();
    const userId = session?.user?.id;
    console.log("✔️ User ID:", userId);
    
    
    const body = await req.json();

    console.log("Received fingerprint data:", body);
    console.log("User ID:", userId);
    
    if(!userId){
        console.error("❌ Missing User ID")
        return NextResponse.json({error: "User ID is missing"}, {status: 400})
    }
    
    const fingerprint = await db.userFingerprint.create({ 
        data: {
            userId: body.userId,
            visitorId: body.visitorId,
            browser: body.browser,
            os: body.os,
            device: body.device,
            confidenceScore: body.confidenceScore,
            botProbability: body.botProbability,
            vpnDetected: body.vpnDetected,
            ips: body.ipAddress
        }
     });
     console.log("✅ Fingerprint saved successfully:", fingerprint);
     
     return NextResponse.json({success: true, fingerprint})
  } catch (error) {
    console.error('Error saving fingerprint:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }

  }

