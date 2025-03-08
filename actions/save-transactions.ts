"use server"

import { db } from "@/lib/db"
import { generateMinFraudReport } from "@/lib/pdf-generator"


// Simplified version without authentication for testing
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function saveTransactionWithReport(formData: any, result: any) {
  try {
    // Generate PDF report
    const pdfBytes = await generateMinFraudReport(result, formData)

    // Map form data to database schema
    const transaction = await db.maxMindTransaction.create({
      data: {
        // Use a placeholder user ID since auth might not be set up
        userId: "placeholder-user-id",
        accountUserId: "placeholder-user-id",

        // Device Information
        deviceIpAddress: formData.ipAddress || "127.0.0.1",

        // Event Details
        eventShopId: formData.shopId || "",
        eventTime: new Date(),
        eventTransactionId: formData.transactionId || "",
        eventType: formData.transactionType || "sale",

        // Account Information
        accountUsername: formData.username || "anonymous",

        // Email Details
        emailAddress: formData.userEmail || "test@example.com",
        emailDomain: formData.userEmail ? formData.userEmail.split("@")[1] : "example.com",

        // Billing Information
        billingAddress: formData.billingAddress1 || "",
        billingAddress2: formData.billingAddress2 || null,
        billingCity: formData.billingCity || "",
        billingCompany: null,
        billingCountry: formData.billingCountry || "US",
        billingFirstName: formData.billingFirstName || "",
        billingLastName: formData.billingLastName || "",
        billingPhoneCountryCode: "1", // Default to US
        billingPhoneNumber: formData.billingPhone || "",
        billingPostal: formData.billingPostal || "",
        billingRegion: formData.billingRegion || "",

        // Shipping Information
        shippingAddress: formData.shippingAddress1 || "",
        shippingAddress2: formData.shippingAddress2 || null,
        shippingCity: formData.shippingCity || "",
        shippingCompany: null,
        shippingCountry: formData.shippingCountry || "US",
        shippingDeliverySpeed: "normal",
        shippingFirstName: formData.shippingFirstName || "",
        shippingLastName: formData.shippingLastName || "",
        shippingPhoneCountryCode: "1", // Default to US
        shippingPhoneNumber: "",
        shippingPostal: formData.shippingPostal || "",
        shippingRegion: formData.shippingRegion || "",

        // Payment Details
        paymentDeclineCode: null,
        paymentProcessor: "stripe", // Default value
        paymentWasAuthorized: true,

        // Credit Card Information
        creditCardAvsResult: formData.avsResult || "",
        creditCardBankName: null,
        creditCardBankPhoneCountryCode: null,
        creditCardBankPhoneNumber: null,
        creditCardCvvResult: formData.cvvResult || "",
        creditCardIssuerIdNumber: formData.cardBin || "",
        creditCardLastDigits: formData.cardLast4 || "",
        creditCardToken: null,
        creditCardWas3DSecureSuccessful: false,

        // Order Details
        orderAmount: Number.parseFloat(formData.transactionAmount) || 0,
        orderCurrency: formData.transactionCurrency || "USD",
        orderDiscountCode: null,
        orderHasGiftMessage: false,
        orderIsGift: false,
        orderReferrerUri: null,
        orderSubaffiliateId: null,

        // Risk Scoring
        riskScore: result.riskScore || 0,
        ipAddressRisk: Math.round(result.ipRiskScore) || 0,

        // Generated PDF
        generatedPdf: Buffer.from(pdfBytes),

        // Shopping Cart Items - empty for now
        shoppingCartItems: {
          create: [],
        },
      },
    })

    return {
      success: true,
      transactionId: transaction.id,
    }
  } catch (error) {
    console.error("Error saving transaction:", error)
    return {
      success: false,
      error: (error as Error).message,
    }
  }
}

