/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";

export const FingerprintList = () => {
  const [fingerprints, setFingerprints] = useState([]);

  useEffect(() => {
    const fetchFingerprints = async () => {
      const res = await fetch("/api/fingerprint");
      const data = await res.json();
      setFingerprints(data);
    };
    fetchFingerprints();
  }, []);

  return (
    <div>
      <h2>Fingerprint Records</h2>
      <ul>
        {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
        {fingerprints.map((fp: any) => (
          <li key={fp.id}>
            Visitor ID: {fp.visitorId} | Browser: {fp.browser} | OS: {fp.os}
          </li>
        ))}
      </ul>
    </div>
  );
};
