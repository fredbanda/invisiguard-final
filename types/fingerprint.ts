export interface FingerprintData {
    visitorId: string;
    ips: string;
    country: string;
    city: string;
    isp: string;
    fraudScore: number;
    vpnOrProxy: boolean;
    browserName?: string | null;
    browser: string;
    os?: string | null;
    device?: string | null;
    screenResolution?: string | null;
    language?: string | null;
    platform?: string | null;
    timezone?: string | null;
    touchScreen: boolean;
    ipAddress?: string | null;
    incognito: boolean;
    confidenceScore: number;
    botProbability: number;
    vpnDetected: boolean;
    lastUpdated: Date;
  }