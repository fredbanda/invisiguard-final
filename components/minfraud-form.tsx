/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ChevronDown,
  CreditCard,
  Download,
  FileText,
  Globe,
  Home,
  Info,
  MapPin,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InsightsPanel } from "@/components/insights-panel";
import { saveTransactionWithReport } from "@/actions/save-transactions";
import { toast } from "sonner";
import Link from "next/link";

const formSchema = z.object({
  // Transaction
  shopId: z.string().optional(),
  transactionId: z.string().min(1, "Transaction ID is required"),
  transactionAmount: z.string().min(1, "Amount is required"),
  transactionCurrency: z.string().min(1, "Currency is required"),
  transactionType: z.string().min(1, "Transaction type is required"),

  // Credit Card
  cardBin: z.string().optional(),
  cardLast4: z.string().optional(),
  avsResult: z.string().optional(),
  cvvResult: z.string().optional(),

  // Account
  userEmail: z.string().email().optional(),
  username: z.string().optional(),
  accountCreatedAt: z.string().optional(),

  // Billing
  billingFirstName: z.string().optional(),
  billingLastName: z.string().optional(),
  billingAddress1: z.string().optional(),
  billingAddress2: z.string().optional(),
  billingCity: z.string().optional(),
  billingRegion: z.string().optional(),
  billingPostal: z.string().optional(),
  billingCountry: z.string().optional(),
  billingPhone: z.string().optional(),

  // Shipping
  shippingFirstName: z.string().optional(),
  shippingLastName: z.string().optional(),
  shippingAddress1: z.string().optional(),
  shippingAddress2: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingRegion: z.string().optional(),
  shippingPostal: z.string().optional(),
  shippingCountry: z.string().optional(),

  // Device
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  sessionId: z.string().optional(),
});

export default function MinFraudForm() {
  const [result, setResult] = useState<null | {
    riskScore: number;
    fraudScore: number;
    ipRiskScore: number;
    recommendations: string[];
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    warnings?: any[];
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    insights?: any;
  }>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingReport, setIsSavingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Transaction
      shopId: "",
      transactionId: "",
      transactionAmount: "",
      transactionCurrency: "USD",
      transactionType: "sale",

      // Credit Card
      cardBin: "",
      cardLast4: "",
      avsResult: "",
      cvvResult: "",

      // Account
      userEmail: "",
      username: "",
      accountCreatedAt: "",

      // Billing
      billingFirstName: "",
      billingLastName: "",
      billingAddress1: "",
      billingAddress2: "",
      billingCity: "",
      billingRegion: "",
      billingPostal: "",
      billingCountry: "",
      billingPhone: "",

      // Shipping
      shippingFirstName: "",
      shippingLastName: "",
      shippingAddress1: "",
      shippingAddress2: "",
      shippingCity: "",
      shippingRegion: "",
      shippingPostal: "",
      shippingCountry: "",

      // Device
      ipAddress: "",
      userAgent: "",
      sessionId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      setError(null);

      // Auto-populate IP address if not provided
      if (!values.ipAddress) {
        try {
          const ipResponse = await fetch("https://api.ipify.org?format=json");
          const ipData = await ipResponse.json();
          values.ipAddress = ipData.ip;
        } catch (err) {
          console.error("Could not auto-detect IP:", err);
        }
      }

      // Auto-populate user agent if not provided
      if (!values.userAgent && typeof window !== "undefined") {
        values.userAgent = window.navigator.userAgent;
      }

      // For testing with mock data
      //const response = await fetch("/api/minfraud-mock", {
      // For production with real MaxMind API
      const response = await fetch("/api/maxmind", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          useInsights: true, // Set to false to use the score endpoint (uses fewer credits)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from API:", errorData);
        setError(`Error: ${errorData.error || "Failed to get fraud analysis"}`);
        return;
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGenerateReport() {
    if (!result) return;

    try {
      setIsSavingReport(true);

      // Save transaction and generate report
      const saveResult = await saveTransactionWithReport(
        form.getValues(),
        result
      );

      if (saveResult.success) {
        toast.success("The report has been saved to the database.", {
          position: "top-right",
        });
      } else {
        console.error("Error details:", saveResult.error);
        toast("Failed to generate report", {
          position: "top-right",
        });
      }
    } catch (err) {
      console.error("Error generating report:", err);
      toast("An unexpected error occurred while generating the report.", {
        position: "top-right",
      });
    } finally {
      setIsSavingReport(false);
    }
  }

  async function handleDownloadPdf() {
    if (!result) return;

    try {
      // Generate PDF client-side for download
      const { generateMinFraudReport } = await import("@/lib/pdf-generator");
      const pdfBytes = await generateMinFraudReport(result, form.getValues());

      // Create a blob from the PDF bytes
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Create a link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `minfraud-report-${
        form.getValues().transactionId || "unknown"
      }.pdf`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      toast("Failed to download the PDF report.", {
        position: "top-right",
      });
    }
  }

  // async function testApi() {
  //   try {
  //     const response = await fetch("/api/test")
  //     const data = await response.json()
  //     console.log("Test API response:", data)
  //     // biome-ignore lint/style/useTemplate: <explanation>
  //     alert("API test successful: " + JSON.stringify(data))
  //   } catch (err) {
  //     console.error("Test API error:", err)
  //     // biome-ignore lint/style/useTemplate: <explanation>
  //     alert("API test failed: " + (err as Error).message)
  //   }
  // }

  return (
    <div className="container mx-auto py-6 w-[800px]">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-white/80 text-center">
            Invisiguard Fraud Interactive Widget
          </h1>
          <p className="text-white text-center">
            Submit transaction data to evaluate fraud risk using
            Invisiguard&apos;s Fraud service
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <Accordion type="multiple" defaultValue={["transaction"]}>
                  <AccordionItem value="transaction">
                    <AccordionTrigger className="bg-muted/50 px-4 rounded-t-md">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        <span>Transaction Information</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-card border rounded-b-md p-4 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="shopId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Shop ID</FormLabel>
                              <FormControl>
                                <Input placeholder="Shop ID" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="transactionId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transaction ID *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Transaction ID"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="transactionAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount *</FormLabel>
                              <FormControl>
                                <Input placeholder="19.99" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="transactionCurrency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Currency *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="USD">USD</SelectItem>
                                  <SelectItem value="EUR">EUR</SelectItem>
                                  <SelectItem value="GBP">GBP</SelectItem>
                                  <SelectItem value="CAD">CAD</SelectItem>
                                  <SelectItem value="AUD">AUD</SelectItem>
                                  <SelectItem value="ZAR">ZAR</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="transactionType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transaction Type *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="sale">Sale</SelectItem>
                                  <SelectItem value="credit">Credit</SelectItem>
                                  <SelectItem value="authorization">
                                    Authorization
                                  </SelectItem>
                                  <SelectItem value="update">Update</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="creditcard">
                    <AccordionTrigger className="bg-muted/50 px-4 rounded-t-md">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Credit Card Information</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-card border rounded-b-md p-4 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="cardBin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card BIN (first 6 digits)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="123456"
                                  maxLength={6}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                First 6 digits of the credit card number
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cardLast4"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last 4 digits</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="1234"
                                  maxLength={4}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="avsResult"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>AVS Result</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select AVS result" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Y">
                                    Y - Address & 5-digit ZIP match
                                  </SelectItem>
                                  <SelectItem value="A">
                                    A - Address matches, ZIP does not
                                  </SelectItem>
                                  <SelectItem value="Z">
                                    Z - 5-digit ZIP matches, address does not
                                  </SelectItem>
                                  <SelectItem value="N">
                                    N - Neither address nor ZIP match
                                  </SelectItem>
                                  <SelectItem value="U">
                                    U - Address unavailable
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cvvResult"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVV Result</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select CVV result" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="M">
                                    M - CVV matches
                                  </SelectItem>
                                  <SelectItem value="N">
                                    N - CVV does not match
                                  </SelectItem>
                                  <SelectItem value="P">
                                    P - Not processed
                                  </SelectItem>
                                  <SelectItem value="S">
                                    S - Merchant indicated CVV should be on card
                                  </SelectItem>
                                  <SelectItem value="U">
                                    U - Issuer not certified
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="account">
                    <AccordionTrigger className="bg-muted/50 px-4 rounded-t-md">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Account Information</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-card border rounded-b-md p-4 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="userEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="user@example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="accountCreatedAt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Created Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="billing">
                    <AccordionTrigger className="bg-muted/50 px-4 rounded-t-md">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        <span>Billing Information</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-card border rounded-b-md p-4 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="billingFirstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="First name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="billingLastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Last name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="billingAddress1"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address Line 1</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main St" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="billingAddress2"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address Line 2</FormLabel>
                              <FormControl>
                                <Input placeholder="Apt 4B" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="billingCity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="billingRegion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province/Region</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="State/Province"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="billingPostal"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal/ZIP Code</FormLabel>
                              <FormControl>
                                <Input placeholder="12345" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="billingCountry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="US">
                                    United States
                                  </SelectItem>
                                  <SelectItem value="CA">Canada</SelectItem>
                                  <SelectItem value="GB">
                                    United Kingdom
                                  </SelectItem>
                                  <SelectItem value="AU">Australia</SelectItem>
                                  <SelectItem value="DE">Germany</SelectItem>
                                  <SelectItem value="FR">France</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="billingPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="+1 555-123-4567"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="shipping">
                    <AccordionTrigger className="bg-muted/50 px-4 rounded-t-md">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>Shipping Information</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-card border rounded-b-md p-4 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="shippingFirstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="First name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="shippingLastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Last name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="shippingAddress1"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address Line 1</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main St" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="shippingAddress2"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address Line 2</FormLabel>
                              <FormControl>
                                <Input placeholder="Apt 4B" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="shippingCity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="shippingRegion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province/Region</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="State/Province"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="shippingPostal"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal/ZIP Code</FormLabel>
                              <FormControl>
                                <Input placeholder="12345" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="shippingCountry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="US">
                                    United States
                                  </SelectItem>
                                  <SelectItem value="CA">Canada</SelectItem>
                                  <SelectItem value="GB">
                                    United Kingdom
                                  </SelectItem>
                                  <SelectItem value="AU">Australia</SelectItem>
                                  <SelectItem value="DE">Germany</SelectItem>
                                  <SelectItem value="FR">France</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="device">
                    <AccordionTrigger className="bg-muted/50 px-4 rounded-t-md">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>Device Information</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-card border rounded-b-md p-4 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="ipAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>IP Address</FormLabel>
                              <FormControl>
                                <Input placeholder="123.45.67.89" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="sessionId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Session ID</FormLabel>
                              <FormControl>
                                <Input placeholder="abc123xyz" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="md:col-span-2">
                          <FormField
                            control={form.control}
                            name="userAgent"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>User Agent</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..."
                                    className="resize-none"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    name={field.name}
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="flex justify-end gap-2">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Analyzing..." : "Submit for Analysis"}
                  </Button>
                </div>
              </form>
            </Form>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  Fraud risk assessment based on submitted data
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Risk Score</span>
                        <span className="text-sm font-bold">
                          {result.riskScore}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${result.riskScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Fraud Score</span>
                        <span className="text-sm font-bold">
                          {result.fraudScore}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            result.fraudScore > 75
                              ? "bg-destructive"
                              : result.fraudScore > 50
                              ? "bg-warning"
                              : "bg-success"
                          }`}
                          style={{ width: `${result.fraudScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          IP Risk Score
                        </span>
                        <span className="text-sm font-bold">
                          {result.ipRiskScore}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${result.ipRiskScore}%` }}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Recommendations</h3>
                      <ul className="space-y-1">
                        {result?.recommendations?.length ? (
                          result.recommendations.map((rec, i) => (
                            <li
                              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                              key={i}
                              className="text-sm flex items-start gap-2"
                            >
                              <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                                <ChevronDown className="h-3 w-3" />
                              </span>
                              {rec}
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-gray-500">
                            No recommendations available.
                          </li>
                        )}
                      </ul>
                    </div>

                    {result?.insights &&
                      Object.keys(result.insights).length > 0 && (
                        <InsightsPanel insights={result.insights} />
                      )}

                    <Separator />

                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={handleGenerateReport}
                        disabled={isSavingReport}
                        className="w-full"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {isSavingReport
                          ? "Saving..."
                          : "Save Report to Database"}
                      </Button>

                      <Button
                        onClick={handleDownloadPdf}
                        variant="outline"
                        className="w-full"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF Report
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <Info className="h-12 w-12 mb-4 opacity-20" />
                    <p>
                      Submit transaction data to see fraud risk analysis results
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>
                    This form connects to MaxMind&apos;s minFraud API for
                    real-time fraud detection.
                  </AlertDescription>
                </Alert>
              </CardFooter>
              <Link href="/dashboard/minmax-results">
                <Button
                  variant="default"
                  className="w-full bg-black text-white"
                >
                  Go To Dashboard
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
