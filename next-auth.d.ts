// biome-ignore lint/style/useImportType: <explanation>
import { Transaction } from "@maxmind/minfraud-api-node";
// biome-ignore lint/style/useImportType: <explanation>
import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  phone?: string;
  address?: string;
  street: string;
  city: string;
  province: string;
  country: string;
  postcode: string;
  isTwoFactorEnabled?: boolean;
  isOAuth: boolean;
  company: string;
  password?: hashedPassword;
  
}

export interface UserFingerprint {
  visitorId: string;
  browserName?: string | null;
  os?: string | null;
  device?: string | null;
  screenResolution?: string | null;
  language?: string | null;
  platform?: string | null;
  country?: string | null;
  city?: string | null;
  timezone?: string | null;
  touchScreen: boolean;
  isp?: string | null;
  ips?: string | null;
  vpnOrProxy?: boolean | null;
  browser?: string | null;
  fraudScore?: number | null;
  incognito: boolean;
  confidenceScore: number;
  botProbability: number;
  vpnDetected: boolean;
  lastUpdated: Date;
}

export interface Report{
  pdfUrl: string;
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
    fingerprint:{
      visitorId: string;
      ip: string;
      country: string;
      city: string;
      isp: string;
      vpnOrProxy: boolean;
      botProbability: number;
      confidenceScore: number;
      fraudScore: number;
      browser: string;
      os: string; 
      device: string;
      lastUpdated: Date;
      pdfBytes: Uint8Array;
      }
    } 
  }



  interface PenTestReport {
    id: string;
    targetUrl: string;
    status: string;
  }

  interface formattedRequest {
    email: {
      address: email
    };
  }

  interface Scan{
    ip: string;
    pdfData: pdfBytes;
  }
  
import { JWT } from "next-authjwt";

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    phone?: string;
    address?: string;
    street: string;
    city: string;
    province: string;
    country: string;
    postcode: string;
    company: string;
    password?: hashedPassword;
    isTwoFactorEnabled?: boolean;
    }
}


