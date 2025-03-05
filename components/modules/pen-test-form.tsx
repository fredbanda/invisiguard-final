"use client";
import { useEffect, useState } from 'react';

interface PenTestReport {
  id: string;
  targetUrl: string;
  status: string;
}

export  function ReportList() {
  const [reports, setReports] = useState<PenTestReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [targetUrl, setTargetUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        const response = await fetch('/api/reports');
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data: PenTestReport[] = await response.json();
        setReports(data);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        setError('Failed to load reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl) {
      setFormError('Target URL is required.');
      return;
    }

    setFormError(null);

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUrl, userId: 'user-id-placeholder' }), // Replace userId with the actual value
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const newReport: PenTestReport = await response.json();
      setReports((prevReports) => [newReport, ...prevReports]); // Add the new report to the top of the list
      setTargetUrl(''); // Clear the input
    } catch (err) {
      console.error('Failed to create report:', err);
      setFormError('Failed to create report. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center mt-8 text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="w-[600px] mx-auto p-4 mb-12">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Penetration Test Reports</h1>

      {/* Form to Add New Report */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-4">
          <input
            type="url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="Enter target URL"
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            Add Report
          </button>
        </div>
        {formError && <p className="mt-2 text-red-500 text-sm">{formError}</p>}
      </form>

      {/* Table for Reports */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Target URL</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{report.id}</td>
                <td className="border border-gray-300 px-4 py-2">{report.targetUrl}</td>
                <td className="border border-gray-300 px-4 py-2">{report.status}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                  type="button"
                    onClick={() => handleViewReport(report.id)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  function handleViewReport(id: string) {
    window.location.href = `/reports/${id}`;
  }
}
