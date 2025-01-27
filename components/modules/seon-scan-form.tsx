"use client";

import { useState } from 'react';

export function SeonScanForm() {
  const [emails, setEmails] = useState<string[]>([]);
  const [phones, setPhones] = useState<string[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const userId = 'USER_ID'; // Replace with actual logged-in user ID

      const response = await fetch('/api/seon-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, emails, phones, domains }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setMessage('Scan completed successfully!');
    } catch (error: unknown) {
      setMessage(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    
<form onSubmit={handleSubmit} className="w-[600px] mx-auto p-4 bg-white shadow-md rounded-md mt-[-8px]">
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">Emails</label>
    <textarea
      value={emails.join(', ')}
      onChange={(e) => setEmails(e.target.value.split(','))}
      placeholder="Enter emails, separated by commas"
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      disabled={loading}
    />
  </div>
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">Phones</label>
    <textarea
      value={phones.join(', ')}
      onChange={(e) => setPhones(e.target.value.split(','))}
      placeholder="Enter phone numbers, separated by commas"
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      disabled={loading}
    />
  </div>
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">Domains</label>
    <textarea
      value={domains.join(', ')}
      onChange={(e) => setDomains(e.target.value.split(','))}
      placeholder="Enter domains, separated by commas"
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      disabled={loading}
    />
  </div>
  <div className="mb-4">
    <button
      type="submit"
      disabled={loading}
      className={`w-full px-4 py-2 text-white font-medium rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
    >
      {loading ? 'Scanning...' : 'Submit'}
    </button>
  </div>
  {message && (
    <p className="mt-2 text-center text-sm text-green-600">{message}</p>
  )}
</form>

  );
}
