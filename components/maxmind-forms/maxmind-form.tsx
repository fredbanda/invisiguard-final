/* eslint-disable  @typescript-eslint/no-explicit-any */

"use client";

// biome-ignore lint/style/useImportType: <explanation>
import React, { useState } from "react";
import { ResultsSection } from "./results-section";

const MaxMindForm = () => {
  const [formData, setFormData] = useState({
    ipAddress: "",
    userEmail: "",
    cardBin: "",
    cardLast4: "",
    transactionId: "",
    transactionType: "purchase",
    transactionAmount: "",
    transactionCurrency: "USD",
    billingFirstName: "",
    billingLastName: "",
    billingCity: "",
    billingCountry: "",
    billingPostal: "",
    billingPhone: "",
    billingAddress1: "",
    billingAddress2: "",
    billingRegion: "",
    shippingFirstName: "",
    shippingLastName: "",
    shippingCountry: "",
    shippingPostal: "",
    shippingCity: "",
    shippingRegion: "",
    shippingAddress1: "",
    shippingAddress2: "",
    useInsights: false,
    useFactors: true,
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  console.log(response, error);
  

  // List of countries for dropdown
  const countries = [
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "GB", name: "United Kingdom" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "JP", name: "Japan" },
    { code: "CN", name: "China" },
    { code: "IN", name: "India" },
    { code: "BR", name: "Brazil" },
    { code: "ZA", name: "South Africa" },
  ];

  const transactionTypes = [
    { value: "purchase", label: "Purchase" },
    { value: "account_creation", label: "Account Creation" },
    { value: "account_login", label: "Account Login" },
    { value: "email_change", label: "Email Change" },
    { value: "password_reset", label: "Password Reset" },
    { value: "payout", label: "Payout" },
    { value: "survey", label: "Survey" },
    { value: "affiliate_conversion", label: "Affiliate Conversion" },
  ];

  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "INR", name: "Indian Rupee" },
    { code: "ZAR", name: "South African Rand" },
  ];

  // For handleChange, use React's ChangeEvent type
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? type : value,
    });
  };

  // For handleSubmit, use React's FormEvent type
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {

        const response = await fetch("/api/maxmind", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.error || "Failed to get fraud check results");
        }
  
        setResponse(data);
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (error: any) {
        console.error("Error calling MaxMind API:", error);
        setError(error || "An error occurred while processing your request");
      } finally {
        setLoading(false);
      }
    }
  

      

  const handleClear = () => {
    setFormData({
      ipAddress: "",
      userEmail: "",
      cardBin: "",
      cardLast4: "",
      transactionId: "",
      transactionType: "purchase",
      transactionAmount: "",
      transactionCurrency: "USD",
      billingFirstName: "",
      billingLastName: "",
      billingCity: "",
      billingCountry: "",
      billingPostal: "",
      billingPhone: "",
      billingAddress1: "",
      billingAddress2: "",
      billingRegion: "",
      shippingFirstName: "",
      shippingLastName: "",
      shippingCountry: "",
      shippingPostal: "",
      shippingCity: "",
      shippingRegion: "",
      shippingAddress1: "",
      shippingAddress2: "",
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
      useFactors,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-white text-center">
        Invisiguard Fraud Check
      </h1>

      <div className="mb-6 ">
        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            onClick={() => toggleEndpoint(false, false)}
            className={`px-4 py-2 rounded ${
              !formData.useInsights && !formData.useFactors
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Score (Basic)
          </button>
          <button
            type="button"
            onClick={() => toggleEndpoint(true, false)}
            className={`px-4 py-2 rounded ${
              formData.useInsights && !formData.useFactors
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Insights (Advanced)
          </button>
          <button
            type="button"
            onClick={() => toggleEndpoint(false, true)}
            className={`px-4 py-2 rounded ${
              !formData.useInsights && formData.useFactors
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Factors (Detailed)
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4">
              Transaction Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">
                  IP Address*
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Email Address
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Transaction ID
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Transaction Type
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Transaction Amount
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Currency
                </label>
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

            <h2 className="text-xl font-semibold mb-4">
              Credit Card Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">
                  Card BIN/IIN (first 6 digits)
                </label>
                <input
                  type="text"
                  name="cardBin"
                  value={formData.cardBin}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="411111"
                  maxLength={6}
                />
              </div>
              <div>
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">
                  Last 4 Digits
                </label>
                <input
                  type="text"
                  name="cardLast4"
                  value={formData.cardLast4}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="1234"
                  maxLength={4}
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Address Line 1
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Address Line 2
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Region/State
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Postal/ZIP Code
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Country
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Address Line 1
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Address Line 2
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Region/State
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Postal/ZIP Code
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Country
                </label>
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
                {loading ? "Processing..." : "Check Fraud Risk"}
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
        <ResultsSection />
        </div>
    </div>
  );
};

export default MaxMindForm;
