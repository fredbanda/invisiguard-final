"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function IPQSForm() {
  const [emails, setEmails] = useState<string[]>([]);
  const [phones, setPhones] = useState<string[]>([]);
  const [ips, setIps] = useState<string[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);

  const session = useSession();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const userId = session.data?.user.id; // Replace with actual logged-in user ID

    try {
      const res = await fetch("/api/ipqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails, phones, ips, domains, userId }),
      });

      const text = await res.text();
      console.log("RAW API RESPONSE:", text);

      const data = JSON.parse(text);
      if (data.success) {
        setReportId(data.reportId);
      } else {
        console.log("Error generating report");
      }
    } catch (error) {
      console.error("Submission error:", error);
      console.log("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6 max-w-lg mx-auto bg-white shadow rounded mb-10">
      <h2 className="text-xl font-semibold mb-4">IPQS Validation Form</h2>
      <form onSubmit={handleSubmit}>
        <textarea  placeholder="Enter emails (comma separated)" className="w-full border p-2 mb-2" onChange={(e) => setEmails(e.target.value.split(","))} />
        <textarea  placeholder="Enter phone numbers (comma separated)" className="w-full border p-2 mb-2" onChange={(e) => setPhones(e.target.value.split(","))} />
        <textarea  placeholder="Enter IPs (comma separated)" className="w-full border p-2 mb-2" onChange={(e) => setIps(e.target.value.split(","))} />
        <textarea  placeholder="Enter domains (comma separated)" className="w-full border p-2 mb-2" onChange={(e) => setDomains(e.target.value.split(","))} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
      {reportId && (
        <div className="mt-4 text-green-600">
          Report generated! <a href={`/download/${reportId}`} className="underline">Download PDF</a>
        </div>
      )}
    </div>
  );
}

