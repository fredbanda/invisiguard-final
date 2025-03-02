"use client";

import { createReport } from "@/actions/maxmind-report";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function MaxMindReportForm() {
  const [formData, setFormData] = useState({
    ipAddress: "",
    email: "",
    iin: "",
    eventTime: "",
    timezone: "",
    billingCity: "",
    billingCountry: "",
    billingPostalCode: "",
    billingPhone: "",
    shippingAddress1: "",
    shippingAddress2: "",
    shippingCountry: "",
    shippingPostalCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await createReport(formData);
      setMessage(`Report created! Download PDF: ${result.pdfUrl}`);
    } catch (error) {
      setMessage("Error submitting report");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[540px] mx-auto space-y-4 p-6 border rounded-lg shadow-md bg-white mb-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="minFraud Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">minFraud Score</SelectItem>
            <SelectItem value="dark">minFraud Insight</SelectItem>
            <SelectItem value="system">minFraud Factors</SelectItem>
          </SelectContent>
        </Select>

        <input
          name="ipAddress"
          type="text"
          placeholder="IP Address"
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <input
          name="email"
          type="email"
          placeholder="Customer Email Address"
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <input
          name="iin"
          type="text"
          placeholder="Credit Card IIN"
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="eventTime"
          type="datetime-local"
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <input
          name="timezone"
          type="text"
          placeholder="Timezone"
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <input
          name="billingCity"
          type="text"
          placeholder="Billing City"
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="billingCountry"
          type="text"
          placeholder="Billing Country"
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="billingPostalCode"
          type="text"
          placeholder="Billing Postal Code"
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="billingPhone"
          type="text"
          placeholder="Billing Phone Number"
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="shippingAddress1"
          type="text"
          placeholder="Shipping Address 1"
          onChange={handleChange}
          className="border p-2 rounded w-full col-span-2"
        />
        <input
          name="shippingAddress2"
          type="text"
          placeholder="Shipping Address 2"
          onChange={handleChange}
          className="border p-2 rounded w-full col-span-2"
        />
        <input
          name="shippingCountry"
          type="text"
          placeholder="Shipping Country"
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="shippingPostalCode"
          type="text"
          placeholder="Shipping Postal Code"
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Processing..." : "Submit"}
      </button>
      {message && (
        <p className="text-sm text-center text-gray-700 mt-2">{message}</p>
      )}
    </form>
  );
}
