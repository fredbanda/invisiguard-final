export interface FingerprintData {
    visitorId: string;
    browserName?: string | null;
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
  }