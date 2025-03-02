"use client";

import { useEffect, useState } from "react";

interface Report {
  id: string;
  createdAt: string;
  result: string;
  pdfUrl: string;
}

export default function Dashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/reports");
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white/80 text-center">Your Reports</h1>

      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <table className="w-full border border-gray-300 bg-white rounded-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Result</th>
              <th className="p-2 text-left">Download</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-t">
                <td className="p-2">
                  {new Date(report.createdAt).toLocaleString()}
                </td>
                <td className="p-2">{report.result || "N/A"}</td>
                <td className="p-2">
                  {report.pdfUrl ? (
                    <a
                      href={`/api/reports/${report.id}/download`}
                      className="text-blue-500 hover:underline"
                    >
                      Download PDF
                    </a>
                  ) : (
                    "Not available"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
