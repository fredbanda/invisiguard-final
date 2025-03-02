'use client';

import  FingerprintJSPro, { type GetResult } from '@fingerprintjs/fingerprintjs-pro';

let fpPromise: Promise< FingerprintJSPro> | null = null;

export const initFingerprint = (): Promise< FingerprintJSPro> => {
  if (!fpPromise) {
    // Replace with your actual Fingerprint public API key
    fpPromise = FingerprintJSPro.load({ apiKey: 'your-fingerprint-public-api-key' });
  }
  return fpPromise;
};

export const getVisitorData = async (): Promise<GetResult> => {
  const fp = await initFingerprint();
  return await fp.get();
};