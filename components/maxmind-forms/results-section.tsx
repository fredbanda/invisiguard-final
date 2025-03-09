"use client";

import { useState } from "react";

interface RiskResponse {
  riskScore: number;
  ipRiskScore?: number;
  recommendations?: string[];
  warnings?: { code: string; warning: string }[];
  insights?: {
    ipLocation?: {
      city?: string;
      country?: string;
      isp?: string;
    };
  };
}

export const ResultsSection = () => {
  const [response, setResponse] = useState<RiskResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

console.log(setError, setLoading, setResponse);


  return (
    <div className="md:w-1/3">
      <div className="bg-white p-6 rounded-lg shadow-md h-full">
        <h2 className="text-xl font-semibold mb-4">Results</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error:</strong>
            <p>{error}</p>
          </div>
        )}

        {loading && <p className="text-gray-600">Processing request...</p>}

        {!loading && !response && !error && (
          <p className="text-gray-600">
            Submit the form to see fraud check results
          </p>
        )}

        {response && (
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">Risk Score</h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
                  <div
                    className={`h-4 rounded-full ${
                      response?.riskScore < 33
                        ? "bg-green-500"
                        : response.riskScore < 66
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${response.riskScore}%` }}
                  ></div>
                </div>
                <span className="ml-2 font-semibold">{response.riskScore}</span>
              </div>
            </div>

            {response?.ipRiskScore !== undefined && (
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-semibold mb-2">IP Risk Score</h3>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
                    <div
                      className={`h-4 rounded-full ${
                        response.ipRiskScore < 33
                          ? "bg-green-500"
                          : response.ipRiskScore < 66
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${response.ipRiskScore}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 font-semibold">
                    {response.ipRiskScore}
                  </span>
                </div>
              </div>
            )}

            {response.recommendations &&
              response.recommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Recommendations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {response.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {response.warnings && response.warnings.length > 0 && (
              <div className="bg-yellow-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Warnings</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {response.warnings.map((warning, index) => (
                    <li key={index} className="text-sm">
                      {warning.code}: {warning.warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {response.insights && Object.keys(response.insights).length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Additional Insights</h3>
                <div className="space-y-2">
                  {response.insights.ipLocation && (
                    <div>
                      <h4 className="text-sm font-medium">IP Location</h4>
                      <p className="text-sm">
                        {response.insights.ipLocation.city},{" "}
                        {response.insights.ipLocation.country}
                        {response.insights.ipLocation.isp &&
                          ` (${response.insights.ipLocation.isp})`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
