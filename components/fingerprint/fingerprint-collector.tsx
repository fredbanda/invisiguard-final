/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import { useEffect } from "react";

export default function FingerprintCollector() {
  const { data, error, getData } = useVisitorData(
    { extendedResult: true },
    { immediate: true }
  );

  console.log("API Key: ", process.env.NEXT_PUBLIC_FINGERPRINTJS_API_KEY);

  useEffect(() => {
    if (data) {
      console.log("🔍 Collected Fingerprint Data:", data); // ✅ Debugging Log
      saveFingerprint(data);
    }
  }, [data]);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const saveFingerprint = async (fingerprintData: any) => {
    try {
      console.log("📤 Sending Fingerprint to API:", fingerprintData); // ✅ Debugging Log

      const response = await fetch("/api/fingerprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: fingerprintData.visitorId,
          browser: fingerprintData.browserDetails?.browserName || "Unknown",
          os: fingerprintData.browserDetails?.os || "Unknown",
          device: fingerprintData.browserDetails?.device || "Unknown",
          confidenceScore: fingerprintData.confidence?.score || 0,
          botProbability: fingerprintData.botProbability || 0,
          vpnDetected: fingerprintData.vpnDetected || false,
          ipAddress: fingerprintData.ip || "Unknown",
        }),
      });

      const result = await response.json();
      console.log("✅ API Response:", result); // ✅ Debugging Log
    } catch (error) {
      console.error("❌ Error saving fingerprint:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <button type="button" onClick={() => getData({ ignoreCache: true })}>
        Reload Data
      </button>
      {error && <p>Error: {error.message}</p>}
      <p>Visitor ID: {data?.visitorId}</p>
      <p>Browser: {data?.browserName}</p>
      <p>OS: {data?.os}</p>
      <p>OS Version: {data?.osVersion}</p>
      <p>Device: {data?.device}</p>
      <p>Confidence: {data?.confidence.score}</p>
      <p>Bot Probability: {data?.bot?.probability}</p>
      <p>ipAddress: {data?.ip}</p>
      <p>Comment: {data?.zeroTrust?.comment}</p>
      <p>First Seen At: {data?.firstSeenAt.global}</p>
      <p>Last Seen At: {data?.lastSeenAt.global}</p>
      <p>Sealed Results{data?.sealedResult} </p>
    </div>
  );
}
