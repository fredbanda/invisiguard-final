'use client';

import * as FingerprintJSPro from '@fingerprintjs/fingerprintjs-pro';
import type { GetResult } from '@fingerprintjs/fingerprintjs-pro';

let fpPromise: Promise<FingerprintJSPro.Agent> | null = null;

export const initFingerprint = (): Promise<FingerprintJSPro.Agent> => {
  if (!fpPromise) {
    fpPromise = FingerprintJSPro.load({ apiKey: 'your-fingerprint-public-api-key' });
  }
  return fpPromise;
};

export const getVisitorData = async (): Promise<GetResult> => {
  const fp = await initFingerprint();
  return await fp.get();
};
