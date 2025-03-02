"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Report {
  id: string;
  createdAt: string;
  email: string;
  ipAddress: string;
  riskScore: number | null;
  eventTime: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/reports");
        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }
        const data = await response.json();
        setReports(data);
      } catch (err) {
        setError("Error loading reports. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const downloadPdf = async (reportId: string) => {
    window.open(`/api/reports/pdf?id=${reportId}`, "_blank");
  };

  const viewReportDetails = (reportId: string) => {
    router.push(`/reports/${reportId}`);
  };

  if (loading) {
    return <div className="p-6">Loading reports...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (reports.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">IP Quality Score Reports</h1>
        <p>No reports found. Run a validation scan to generate reports.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">IP Quality Score Reports</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">IP Address</th>
              <th className="py-2 px-4 border-b">Risk Score</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  {new Date(report.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b">{report.email}</td>
                <td className="py-2 px-4 border-b">{report.ipAddress}</td>
                <td className="py-2 px-4 border-b">
                  {report.riskScore !== null
                    ? `${report.riskScore.toFixed(2)}/100`
                    : "N/A"}
                </td>
                <td className="py-2 px-4 border-b space-x-2">
                  <button
                    onClick={() => viewReportDetails(report.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => downloadPdf(report.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}