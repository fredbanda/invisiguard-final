/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { generatePDF } from "@/utils/generatePDF";
import { useState } from "react";

const SeonScanComponent = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [phones, setPhones] = useState<string[]>([]);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [scanResults, setScanResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/seon-scan-initiator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emails, domains, phones }),
      });

      if (!response.ok) {
        const errorText = await response.text() as string;
        console.error("Error:", errorText);
        throw new Error("Failed to fetch scan results");
      }

      const data = await response.json();
      setScanResults(data);

      // Generate PDF
      const pdfBytes = await generatePDF(data, "Seon Scan Results", null);

      // Trigger PDF download
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "seon_scan_results.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 mb-10">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
        Check Scam History
      </h2>
      <form className="space-y-4">
        {[
          {
            label: "Scan Emails",
            setter: setEmails,
            placeholder: "Enter emails, separated by commas",
          },
          {
            label: "Scan Phone Numbers",
            setter: setPhones,
            placeholder: "Enter phone numbers, separated by commas",
          },
          {
            label: "Scan Domains",
            setter: setDomains,
            placeholder: "Enter domains, separated by commas",
          },
        ].map(({ label, setter, placeholder }, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div key={index}>
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
              {label}
            </label>
            <textarea
              onChange={(e) => setter(e.target.value.split(","))}
              placeholder={placeholder}
              className="w-full p-3 text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        ))}

        <button
          type="button"
          className="w-full px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
          onClick={handleScan}
          disabled={loading}
        >
          {loading ? "Checking, please wait..." : "Start Checking"}
        </button>
      </form>

      {scanResults && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Check Results:
          </h3>
          <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
            {JSON.stringify(scanResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SeonScanComponent;
