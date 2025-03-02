'use client';

import { useEffect, useState } from 'react';
import { getVisitorData } from '@/lib/fingerprint';
import { saveFingerprint } from '@/actions/fingerprint';
import type { FingerprintData } from '@/types/fingerprint';

export default function FingerprintCapture(): JSX.Element | null {
  const [status, setStatus] = useState<'idle' | 'capturing' | 'completed' | 'error'>('idle');

  useEffect(() => {
    const captureFingerprint = async (): Promise<void> => {
      try {
        setStatus('capturing');
        
        // Get fingerprint data
        const visitorData = await getVisitorData();
        console.log('Raw fingerprint data:', visitorData);
        
        // Create a safe accessor function to handle potential undefined properties
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        const safeGet = (obj: any, path: string, defaultValue: any = null) => {
          const parts = path.split('.');
          let current = obj;
          for (const part of parts) {
            if (current === undefined || current === null) return defaultValue;
            current = current[part];
          }
          return current === undefined ? defaultValue : current;
        };
        
        // Format the data according to your schema using safe accessors
        const fingerprintData: FingerprintData = {
          visitorId: visitorData.visitorId,
          browserName: safeGet(visitorData, 'browserName') || 
                       safeGet(visitorData, 'browser.name') || 
                       safeGet(visitorData, 'browserDetails.browser.name'),
          os: safeGet(visitorData, 'os.name') || 
              safeGet(visitorData, 'browserDetails.os.name'),
          device: safeGet(visitorData, 'device.name') || 
                 safeGet(visitorData, 'browserDetails.device.name'),
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          language: navigator.language || null,
          platform: navigator.platform || null,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
          touchScreen: !!('ontouchstart' in window),
          ipAddress: safeGet(visitorData, 'ip'),
          incognito: safeGet(visitorData, 'incognito', false),
          confidenceScore: safeGet(visitorData, 'confidence', 0),
          botProbability: safeGet(visitorData, 'bot.probability', 0),
          vpnDetected: safeGet(visitorData, 'ipLocation.isVpn', false)
        };
        
        console.log('Processed fingerprint data:', fingerprintData);
        
        // Save to database
        await saveFingerprint(fingerprintData);
        setStatus('completed');
      } catch (error) {
        console.error('Error capturing fingerprint:', error);
        setStatus('error');
      }
    };

    // Only capture for authenticated users
    captureFingerprint();
  }, []);

  // Component doesn't need to render anything visible
  return null;
}