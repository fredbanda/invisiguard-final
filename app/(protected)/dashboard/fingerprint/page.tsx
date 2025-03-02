// components/FingerprintDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type UserFingerprint = {
  id: string;
  visitorId: string;
  browser: string | null;
  os: string | null;
  device: string | null;
  confidenceScore: number;
  botProbability: number;
  vpnDetected: boolean;
  createdAt: string;
};

export default function FingerprintDashboard(): JSX.Element {
  const [fingerprints, setFingerprints] = useState<UserFingerprint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFingerprints = async () => {
      try {
        const response = await fetch('/api/fingerprint/list');
        if (!response.ok) {
          throw new Error('Failed to fetch fingerprints');
        }
        const data = await response.json();
        setFingerprints(data);
      } catch (error) {
        console.error('Error fetching fingerprints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFingerprints();
  }, []);

  if (loading) {
    return <div>Loading fingerprint data...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Fingerprints</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Visitor ID</th>
              <th className="p-2 border">Browser</th>
              <th className="p-2 border">OS</th>
              <th className="p-2 border">Device</th>
              <th className="p-2 border">Confidence</th>
              <th className="p-2 border">Bot Probability</th>
              <th className="p-2 border">VPN</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {fingerprints.map((fp) => (
              <tr key={fp.id} className="hover:bg-gray-50">
                <td className="p-2 border">{fp.visitorId.substring(0, 8)}...</td>
                <td className="p-2 border">{fp.browser || 'Unknown'}</td>
                <td className="p-2 border">{fp.os || 'Unknown'}</td>
                <td className="p-2 border">{fp.device || 'Unknown'}</td>
                <td className="p-2 border">{(fp.confidenceScore * 100).toFixed(1)}%</td>
                <td className="p-2 border">{(fp.botProbability * 100).toFixed(1)}%</td>
                <td className="p-2 border">{fp.vpnDetected ? 'Yes' : 'No'}</td>
                <td className="p-2 border">{new Date(fp.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 

