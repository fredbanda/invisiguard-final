"use client"

import React, { useState } from 'react';

const MaxMindForm = () => {
  const [endpoint, setEndpoint] = useState('factors');
  const [formData, setFormData] = useState({
    ipAddress: '',
    customerEmail: '',
    creditCardIIN: '',
    eventTime: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:MM
    eventTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    billingCity: '',
    billingCountry: '',
    billingPostalCode: '',
    billingPhone: '',
    billingAddress1: '',
    billingAddress2: '',
    shippingCountry: '',
    shippingPostalCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

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
    // Add more countries as needed
  ];

  // Timezone options
  const timeZones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
    'Pacific/Auckland',
    // Add more timezones as needed
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock API call - replace with your actual implementation
    try {
      // In a real implementation, you would call your MaxMind API here
      // const result = await callMaxMindAPI(endpoint, formData);
      
      // Simulating API response for demonstration
      setTimeout(() => {
        const mockResponse = {
          endpoint,
          timestamp: new Date().toISOString(),
          data: {
            riskScore: endpoint === 'score' ? 42 : undefined,
            factors: endpoint === 'factors' ? ['location', 'billing_shipping_mismatch', 'credit_card_issuer_risk', 'email_velocity'] : undefined,
            insights: endpoint === 'insights' ? { 
              locationRisk: 'Medium',
              emailDomain: 'Previously associated with fraud',
              billingShippingMatch: 'Different countries detected',
              creditCardIssuerRisk: 'Low'
            } : undefined
          }
        };
        
        setResponse(mockResponse);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error calling MaxMind API:', error);
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      ipAddress: '',
      customerEmail: '',
      creditCardIIN: '',
      eventTime: new Date().toISOString().slice(0, 16),
      eventTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      billingCity: '',
      billingCountry: '',
      billingPostalCode: '',
      billingPhone: '',
      billingAddress1: '',
      billingAddress2: '',
      shippingCountry: '',
      shippingPostalCode: '',
    });
    setResponse(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">MaxMind Risk Check</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Endpoint Selection */}
        <div className="bg-gray-50 p-4 rounded-md">
          {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
<label className="block text-sm font-medium text-gray-700 mb-2">
            Select MaxMind Endpoint
          </label>
          <select 
            value={endpoint} 
            onChange={(e) => setEndpoint(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="factors">Factors</option>
            <option value="insights">Insights</option>
            <option value="score">Score</option>
          </select>
        </div>
        
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
<label className="block text-sm font-medium text-gray-700 mb-1">
              IP Address *
            </label>
            <input 
              type="text" 
              name="ipAddress"
              value={formData.ipAddress} 
              onChange={handleChange}
              placeholder="e.g. 203.0.113.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Email *
            </label>
            <input 
              type="email" 
              name="customerEmail"
              value={formData.customerEmail} 
              onChange={handleChange}
              placeholder="user@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credit Card IIN (first 6 digits) *
            </label>
            <input 
              type="text" 
              name="creditCardIIN"
              value={formData.creditCardIIN} 
              onChange={handleChange}
              placeholder="e.g. 411111"
              maxLength="6"
              pattern="\d{6}"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <small className="text-gray-500">First 6 digits of the credit card number</small>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Time *
            </label>
            <input 
              type="datetime-local" 
              name="eventTime"
              value={formData.eventTime} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Zone *
            </label>
            <select 
              name="eventTimeZone"
              value={formData.eventTimeZone} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {timeZones.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Billing Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Billing Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing City *
              </label>
              <input 
                type="text" 
                name="billingCity"
                value={formData.billingCity} 
                onChange={handleChange}
                placeholder="City"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Country *
              </label>
              <select 
                name="billingCountry"
                value={formData.billingCountry} 
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Postal Code *
              </label>
              <input 
                type="text" 
                name="billingPostalCode"
                value={formData.billingPostalCode} 
                onChange={handleChange}
                placeholder="Postal Code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Phone *
              </label>
              <input 
                type="tel" 
                name="billingPhone"
                value={formData.billingPhone} 
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Address 1 *
              </label>
              <input 
                type="text" 
                name="billingAddress1"
                value={formData.billingAddress1} 
                onChange={handleChange}
                placeholder="Street Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Address 2
              </label>
              <input 
                type="text" 
                name="billingAddress2"
                value={formData.billingAddress2} 
                onChange={handleChange}
                placeholder="Apartment, suite, unit, etc. (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
        
        {/* Shipping Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Shipping Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Country *
              </label>
              <select 
                name="shippingCountry"
                value={formData.shippingCountry} 
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Postal Code *
              </label>
              <input 
                type="text" 
                name="shippingPostalCode"
                value={formData.shippingPostalCode} 
                onChange={handleChange}
                placeholder="Postal Code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
          
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium  bg-slate-400 text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Clear
          </button>
        </div>
      </form>
      
      {/* Response Display */}
      {response && (
        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <h3 className="font-medium mb-2">Response from {endpoint} endpoint:</h3>
          <pre className="text-sm overflow-x-auto">
            {endpoint === 'score' && (
              <div>
                <span className="font-bold">Risk Score:</span> {response.data.riskScore}
              </div>
            )}
            {endpoint === 'factors' && (
              <div>
                <span className="font-bold">Risk Factors:</span> 
                <ul className="list-disc pl-5 mt-2">
                  {response.data.factors.map(factor => (
                    <li key={factor}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
            {endpoint === 'insights' && (
              <div>
                <span className="font-bold">Risk Insights:</span>
                <ul className="list-disc pl-5 mt-2">
                  {Object.entries(response.data.insights).map(([key, value]) => (
                    <li key={key}><span className="font-medium">{key}:</span> {value}</li>
                  ))}
                </ul>
              </div>
            )}
          </pre>
        </div>
      )}
    </div>
  );
};

export default MaxMindForm;