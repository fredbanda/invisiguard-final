"use client";

import { saveFingerprint } from "@/actions/fingerprint-actions";
import { useState } from "react";

const FingerprintCapture = () => {
  const [loading, setLoading] = useState(false);

  const handleCapture = async () => {
    setLoading(true);
    try {
      const screenResolution = `${window.screen.width}x${window.screen.height}`;
      const fingerprintData = {
        userId: "some-user-id",
        visitorId: "some-visitor-id",
        browser: navigator.userAgent,
        os: navigator.platform,
        device: "Unknown",
        screenResolution,
        language: navigator.language,
        platform: navigator.platform,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        touchScreen: navigator.maxTouchPoints > 0,
        ipAddress: "Fetching...", // Needs backend API for real IP
        incognito: false,
        confidenceScore: 0.9,
        botProbability: 0.1,
        vpnDetected: false,
      };

      await saveFingerprint(fingerprintData);
      alert("Fingerprint saved successfully!");
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <button type="button" onClick={handleCapture} disabled={loading}>
      {loading ? "Saving..." : "Capture Fingerprint"}
    </button>
  );
};

export default FingerprintCapture;
