"use client";

// biome-ignore lint/style/useImportType: <explanation>
import React, { useState} from 'react';

const MaxMindForm = () => {
  const [formData, setFormData] = useState({
    ipAddress: '',
    userEmail: '',
    cardBin: '',
    cardLast4: '',
    transactionId: '',
    transactionType: 'purchase',
    transactionAmount: '',
    transactionCurrency: 'USD',
    billingFirstName: '',
    billingLastName: '',
    billingCity: '',
    billingCountry: '',
    billingPostal: '',
    billingPhone: '',
    billingAddress1: '',
    billingAddress2: '',
    billingRegion: '',
    shippingFirstName: '',
    shippingLastName: '',
    shippingCountry: '',
    shippingPostal: '',
    shippingCity: '',
    shippingRegion: '',
    shippingAddress1: '',
    shippingAddress2: '',
    useInsights: false,
    useFactors: true,
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // List of countries for dropdown
  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'CN', name: 'China' },
    { code: 'IN', name: 'India' },
    { code: 'BR', name: 'Brazil' },
  ];

  const transactionTypes = [
    { value: 'purchase', label: 'Purchase' },
    { value: 'account_creation', label: 'Account Creation' },
    { value: 'account_login', label: 'Account Login' },
    { value: 'email_change', label: 'Email Change' },
    { value: 'password_reset', label: 'Password Reset' },
    { value: 'payout', label: 'Payout' },
    { value: 'survey', label: 'Survey' },
    { value: 'affiliate_conversion', label: 'Affiliate Conversion' },
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'INR', name: 'Indian Rupee' },
  ];

  // For handleChange, use React's ChangeEvent type
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value, type, checked } = e.target;
  setFormData({
    ...formData,
    [name]: type === 'checkbox' ? checked : value
  });
};

// For handleSubmit, use React's FormEvent type
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  
  try {
    const response = await fetch('/api/maxmind', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get fraud check results');
    }
    
    setResponse(data);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    console.error('Error calling MaxMind API:', error);
    setError(error.message || 'An error occurred while processing your request');
  } finally {
    setLoading(false);
  }
};

  const handleClear = () => {
    setFormData({
      ipAddress: '',
      userEmail: '',
      cardBin: '',
      cardLast4: '',
      transactionId: '',
      transactionType: 'purchase',
      transactionAmount: '',
      transactionCurrency: 'USD',
      billingFirstName: '',
      billingLastName: '',
      billingCity: '',
      billingCountry: '',
      billingPostal: '',
      billingPhone: '',
      billingAddress1: '',
      billingAddress2: '',
      billingRegion: '',
      shippingFirstName: '',
      shippingLastName: '',
      shippingCountry: '',
      shippingPostal: '',
      shippingCity: '',
      shippingRegion: '',
      shippingAddress1: '',
      shippingAddress2: '',
      useInsights: false,
      useFactors: true,
    });
    setResponse(null);
    setError(null);
  };

  // Toggle between different MaxMind API products
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const toggleEndpoint = (useInsights: any, useFactors: any) => {
    setFormData({
      ...formData,
      useInsights,
      useFactors
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-white text-center">Invisiguard Fraud Check</h1>
      
      <div className="mb-6 ">
        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            onClick={() => toggleEndpoint(false, false)}
            className={`px-4 py-2 rounded ${!formData.useInsights && !formData.useFactors ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Score (Basic)
          </button>
          <button
            type="button"
            onClick={() => toggleEndpoint(true, false)}
            className={`px-4 py-2 rounded ${formData.useInsights && !formData.useFactors ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Insights (Advanced)
          </button>
          <button
            type="button"
            onClick={() => toggleEndpoint(false, true)}
            className={`px-4 py-2 rounded ${!formData.useInsights && formData.useFactors ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Factors (Detailed)
          </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Transaction Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
<label className="block text-sm font-medium mb-1">IP Address*</label>
                <input
                  type="text"
                  name="ipAddress"
                  value={formData.ipAddress}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="123.45.67.89"
                  required
                />
              </div>
              <div>
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
<label className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="customer@example.com"
                />
              </div>
              <div>
                 {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">Transaction ID</label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Order or transaction ID"
                />
              </div>
              <div>
                 {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">Transaction Type</label>
                <select
                  name="transactionType"
                  value={formData.transactionType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  {transactionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                 {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">Transaction Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="transactionAmount"
                  value={formData.transactionAmount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="99.99"
                />
              </div>
              <div>
                 {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">Currency</label>
                <select
                  name="transactionCurrency"
                  value={formData.transactionCurrency}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Credit Card Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">Card BIN/IIN (first 6 digits)</label>
                <input
                  type="text"
                  name="cardBin"
                  value={formData.cardBin}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="411111"
                  maxLength="6"
                />
              </div>
              <div>
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">Last 4 Digits</label>
                <input
                  type="text"
                  name="cardLast4"
                  value={formData.cardLast4}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="1234"
                  maxLength="4"
                />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                 {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="billingFirstName"
                  value={formData.billingFirstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                 {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="billingLastName"
                  value={formData.billingLastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                 {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">Address Line 1</label>
                <input
                  type="text"
                  name="billingAddress1"
                  value={formData.billingAddress1}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                 {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">Address Line 2</label>
                <input
                  type="text"
                  name="billingAddress2"
                  value={formData.billingAddress2}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                 {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  name="billingCity"
                  value={formData.billingCity}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                 {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">Region/State</label>
                <input
                  type="text"
                  name="billingRegion"
                  value={formData.billingRegion}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                 {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">Postal/ZIP Code</label>
                <input
                  type="text"
                  name="billingPostal"
                  value={formData.billingPostal}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                 {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">Country</label>
                <select
                  name="billingCountry"
                  value={formData.billingCountry}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                 {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  name="billingPhone"
                  value={formData.billingPhone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                 {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="shippingFirstName"
                  value={formData.shippingFirstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                 {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="shippingLastName"
                  value={formData.shippingLastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                 {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">Address Line 1</label>
                <input
                  type="text"
                  name="shippingAddress1"
                  value={formData.shippingAddress1}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                 {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">Address Line 2</label>
                <input
                  type="text"
                  name="shippingAddress2"
                  value={formData.shippingAddress2}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                 {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  name="shippingCity"
                  value={formData.shippingCity}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                 {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">Region/State</label>
                <input
                  type="text"
                  name="shippingRegion"
                  value={formData.shippingRegion}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                  {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">Postal/ZIP Code</label>
                <input
                  type="text"
                  name="shippingPostal"
                  value={formData.shippingPostal}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                 {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">Country</label>
                <select
                  name="shippingCountry"
                  value={formData.shippingCountry}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Check Fraud Risk'}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-6 py-2 bg-gray-700 rounded hover:bg-red-500 text-white "
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
        
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
              <p className="text-gray-600">Submit the form to see fraud check results</p>
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
                          response.riskScore < 33 ? 'bg-green-500' : 
                          response.riskScore < 66 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${response.riskScore}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 font-semibold">{response.riskScore}</span>
                  </div>
                </div>
                
                {response.ipRiskScore !== undefined && (
                  <div className="bg-gray-100 p-4 rounded">
                    <h3 className="font-semibold mb-2">IP Risk Score</h3>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
<div
                          className={`h-4 rounded-full ${
                            response.ipRiskScore < 33 ? 'bg-green-500' : 
                            response.ipRiskScore < 66 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${response.ipRiskScore}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 font-semibold">{response.ipRiskScore}</span>
                    </div>
                  </div>
                )}
                
                {response.recommendations && response.recommendations.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Recommendations</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {response.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm">{rec}</li>
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
                            {response.insights.ipLocation.city}, {response.insights.ipLocation.country}
                            {response.insights.ipLocation.isp && ` (${response.insights.ipLocation.isp})`}
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
      </div>
    </div>
  );
};

export default MaxMindForm;