/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import crypto from "node:crypto";

interface MaxMindResponse {
  risk_score?: number;
  fraud_score?: number;
  ip_address?: {
    risk?: number;
    country?: { names?: { en?: string } };
    city?: { names?: { en?: string } };
    traits?: { isp?: string };
  };
  warnings?: any[];
  email?: { is_free?: boolean };
  billing_address?: { is_postal_in_city?: boolean };
  shipping_address?: { distance_to_billing_address?: number };
}

// MaxMind API endpoints
const MINFRAUD_SCORE_URL = "https://minfraud.maxmind.com/minfraud/v2.0/score";
const MINFRAUD_INSIGHTS_URL =
  "https://minfraud.maxmind.com/minfraud/v2.0/insights";
const MINFRAUD_FACTORS_URL =
  "https://minfraud.maxmind.com/minfraud/v2.0/factors";

// MD5 hash function
const md5 = (input: crypto.BinaryLike): string =>
  crypto.createHash("md5").update(input).digest("hex");

// Type definition for expected request body
interface MinFraudRequest {
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  shopId?: string;
  transactionId?: string;
  transactionType?: string;
  username?: string;
  accountCreatedAt?: string | number | Date;
  userEmail?: string;
  billingFirstName?: string;
  billingLastName?: string;
  billingAddress1?: string;
  billingAddress2?: string;
  billingCity?: string;
  billingRegion?: string;
  billingPostal?: string;
  billingCountry?: string;
  billingPhone?: string;
  shippingFirstName?: string;
  shippingLastName?: string;
  shippingAddress1?: string;
  shippingAddress2?: string;
  shippingCity?: string;
  shippingRegion?: string;
  shippingPostal?: string;
  shippingCountry?: string;
  transactionAmount?: string;
  transactionCurrency?: string;
  cardBin?: string;
  cardLast4?: string;
  avsResult?: string;
  cvvResult?: string;
  useInsights?: boolean;
  useFactors?: boolean;
}

export async function POST(request: Request) {
  try {
    console.log(`Handling ${request.method} request to MaxMind API wrapper`);

    if (!request || !request.body) {
      return NextResponse.json(
        { error: "Invalid request", code: "INVALID_REQUEST" },
        { status: 400 }
      );
    }

    // Debug API key usage
    const accountId =
      process.env.MINFRAUD_ACCOUNT_ID || process.env.MAXMIND_ACCOUNT_ID;
    const licenseKey =
      process.env.MINFRAUD_LICENSE_KEY || process.env.MAXMIND_LICENSE_KEY;

    console.log(
      `Account ID present: ${!!accountId}, License Key present: ${!!licenseKey}`
    );

    if (!accountId || !licenseKey) {
      console.error("MaxMind API credentials missing");
      return NextResponse.json(
        {
          error: "MaxMind credentials not configured",
          code: "CREDENTIALS_MISSING",
        },
        { status: 500 }
      );
    }

    let formData: MinFraudRequest;
    try {
      formData = await request.json();
      console.log("Request body parsed successfully", formData);
    } catch (error) {
      console.error("Failed to parse request body:", error);

      const rawBody = await request
        .text()
        .catch(() => "Unable to read request body");
      console.error(
        "Raw request body:",
        rawBody.substring(0, 200) + (rawBody.length > 200 ? "..." : "")
      );

      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
          code: "INVALID_JSON",
          details: error,
          bodyPreview:
            rawBody.substring(0, 100) + (rawBody.length > 100 ? "..." : ""),
        },
        { status: 400 }
      );
    }

    if (!formData.ipAddress) {
      return NextResponse.json(
        { error: "IP address is required", code: "MISSING_IP_ADDRESS" },
        { status: 400 }
      );
    }

    const endpoint = formData.useInsights
      ? MINFRAUD_INSIGHTS_URL
      : formData.useFactors
      ? MINFRAUD_FACTORS_URL
      : MINFRAUD_SCORE_URL;

    const minfraudData = transformFormDataToMinFraudFormat(formData);

    if (!minfraudData.device?.ip_address) {
      return NextResponse.json(
        { error: "Failed to transform IP address", code: "TRANSFORM_ERROR" },
        { status: 400 }
      );
    }

    console.log(`Making request to MaxMind endpoint: ${endpoint}`);
    console.log("Request payload:", JSON.stringify(minfraudData));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${accountId}:${licenseKey}`
          ).toString("base64")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(minfraudData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`Response status: ${response.status}`);
      console.log(
        `Response content-type: ${response.headers.get("content-type")}`
      );

      if (!response.ok) {
        const responseText = await response.text();

        if (
          responseText.trim().startsWith("<!DOCTYPE") ||
          responseText.trim().startsWith("<html")
        ) {
          console.error("Received unexpected HTML response from MaxMind API.");
          return NextResponse.json(
            {
              error: "Received HTML instead of JSON from MaxMind API",
              code: "HTML_RESPONSE",
              htmlPreview:
                responseText.substring(0, 200) +
                (responseText.length > 200 ? "..." : ""),
            },
            { status: 502 }
          );
        }

        return NextResponse.json(
          {
            error: `MaxMind API error (${response.status})`,
            code: "API_ERROR",
            details: responseText,
          },
          { status: response.status }
        );
      }

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      let data: any;
      try {
        data = await response.json();
        console.log("Successfully parsed JSON response", data);
      } catch (error) {
        console.error("Failed to parse JSON response:", error);

        const rawResponse = await response
          .text()
          .catch(() => "Unable to read response body");

        if (
          rawResponse.trim().startsWith("<!DOCTYPE") ||
          rawResponse.trim().startsWith("<html")
        ) {
          return NextResponse.json(
            {
              error: "Received HTML instead of JSON from MaxMind API",
              code: "HTML_RESPONSE",
              htmlPreview:
                rawResponse.substring(0, 200) +
                (rawResponse.length > 200 ? "..." : ""),
            },
            { status: 502 }
          );
        }

        return NextResponse.json(
          {
            error: "Invalid JSON in MaxMind API response",
            code: "INVALID_JSON_RESPONSE",
            details: error,
            responsePreview:
              rawResponse.substring(0, 200) +
              (rawResponse.length > 200 ? "..." : ""),
          },
          { status: 502 }
        );
      }

      return NextResponse.json(data);
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        console.error("Request to MaxMind API timed out");
        return NextResponse.json(
          { error: "Request to MaxMind API timed out", code: "TIMEOUT" },
          { status: 504 }
        );
      }

      console.error("Unhandled error in MaxMind API request:", error);

      return NextResponse.json(
        {
          error: "MaxMind API request failed",
          code: "INTERNAL_ERROR",
          details: error,
          stack:
            process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Critical error in MaxMind API handler:", error);

    return NextResponse.json(
      {
        error: "Critical failure in API handler",
        code: "CRITICAL_ERROR",
        details: error,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// Rest of the functions remain the same
function transformFormDataToMinFraudFormat(formData: MinFraudRequest): any {
  const result: any = {};

  // Device data
  if (formData.ipAddress || formData.userAgent || formData.sessionId) {
    result.device = {};
    if (formData.ipAddress) result.device.ip_address = formData.ipAddress;
    if (formData.userAgent) result.device.user_agent = formData.userAgent;
    if (formData.sessionId) result.device.session_id = formData.sessionId;
  }

  // Account data
  if (formData.username || formData.accountCreatedAt) {
    result.account = {};
    if (formData.username) result.account.username_md5 = md5(formData.username);
    if (formData.accountCreatedAt) {
      try {
        result.account.created_at = new Date(
          formData.accountCreatedAt
        ).toISOString();
      } catch (error) {
        console.warn(
          "Invalid date format for accountCreatedAt:",
          formData.accountCreatedAt
        );
      }
    }
  }

  // Email data
  if (formData.userEmail) {
    const parts = formData.userEmail.split("@");
    if (parts.length === 2) {
      result.email = {
        address: formData.userEmail,
        domain: parts[1],
      };
    }
  }

  // Billing data
  if (
    formData.billingFirstName ||
    formData.billingLastName ||
    formData.billingAddress1 ||
    formData.billingCity ||
    formData.billingRegion ||
    formData.billingPostal ||
    formData.billingCountry ||
    formData.billingPhone
  ) {
    result.billing = {};
    if (formData.billingFirstName)
      result.billing.first_name = formData.billingFirstName;
    if (formData.billingLastName)
      result.billing.last_name = formData.billingLastName;
    if (formData.billingAddress1)
      result.billing.address = formData.billingAddress1;
    if (formData.billingAddress2)
      result.billing.address_2 = formData.billingAddress2;
    if (formData.billingCity) result.billing.city = formData.billingCity;
    if (formData.billingRegion) result.billing.region = formData.billingRegion;
    if (formData.billingPostal) result.billing.postal = formData.billingPostal;
    if (formData.billingCountry)
      result.billing.country = formData.billingCountry;
    if (formData.billingPhone)
      result.billing.phone_number = formData.billingPhone;
  }

  // Shipping data
  if (
    formData.shippingFirstName ||
    formData.shippingLastName ||
    formData.shippingAddress1 ||
    formData.shippingCity ||
    formData.shippingRegion ||
    formData.shippingPostal ||
    formData.shippingCountry
  ) {
    result.shipping = {};
    if (formData.shippingFirstName)
      result.shipping.first_name = formData.shippingFirstName;
    if (formData.shippingLastName)
      result.shipping.last_name = formData.shippingLastName;
    if (formData.shippingAddress1)
      result.shipping.address = formData.shippingAddress1;
    if (formData.shippingAddress2)
      result.shipping.address_2 = formData.shippingAddress2;
    if (formData.shippingCity) result.shipping.city = formData.shippingCity;
    if (formData.shippingRegion)
      result.shipping.region = formData.shippingRegion;
    if (formData.shippingPostal)
      result.shipping.postal = formData.shippingPostal;
    if (formData.shippingCountry)
      result.shipping.country = formData.shippingCountry;
  }

  // Credit card data
  if (
    formData.cardBin ||
    formData.cardLast4 ||
    formData.avsResult ||
    formData.cvvResult
  ) {
    result.credit_card = {};
    if (formData.cardBin)
      result.credit_card.issuer_id_number = formData.cardBin;
    if (formData.cardLast4)
      result.credit_card.last_4_digits = formData.cardLast4;
    if (formData.avsResult) result.credit_card.avs_result = formData.avsResult;
    if (formData.cvvResult) result.credit_card.cvv_result = formData.cvvResult;
  }

  // Order data
  if (
    formData.transactionAmount ||
    formData.transactionCurrency ||
    formData.transactionId ||
    formData.shopId ||
    formData.transactionType
  ) {
    result.order = {};

    if (formData.transactionAmount) {
      const amount = parseFloat(formData.transactionAmount);
      if (!isNaN(amount)) {
        result.order.amount = amount;
      }
    }

    if (formData.transactionCurrency)
      result.order.currency = formData.transactionCurrency;
    if (formData.transactionId)
      result.order.transaction_id = formData.transactionId;
    if (formData.shopId) result.order.shop_id = formData.shopId;
    if (formData.transactionType)
      result.order.transaction_type = formData.transactionType;
  }

  return result;
}

function generateRecommendations(data: MaxMindResponse) {
  const recommendations = [];

  // Risk score based recommendations
  const riskScore = data.risk_score ?? 0;
  if (riskScore > 90) {
    recommendations.push(
      "Very high risk transaction - manual review strongly recommended"
    );
  } else if (riskScore > 75) {
    recommendations.push(
      "High risk transaction - consider additional verification steps"
    );
  } else if (riskScore > 50) {
    recommendations.push("Medium risk transaction - monitor closely");
  }

  // IP-specific recommendations
  if ((data.ip_address?.risk ?? 0) > 80) {
    recommendations.push(
      "IP address has high risk score - potential proxy/VPN usage"
    );
  }

  // Email recommendations
  if (data.email?.is_free === true) {
    recommendations.push(
      "Free email service used - consider this in risk assessment"
    );
  }

  // Address validation recommendations
  if (data.billing_address?.is_postal_in_city === false) {
    recommendations.push("Postal code doesn't match city in billing address");
  }

  if ((data.shipping_address?.distance_to_billing_address ?? 0) > 1000) {
    recommendations.push(
      "Large distance between shipping and billing addresses"
    );
  }

  return recommendations;
}

function processMinFraudResponse(data: MaxMindResponse) {
  return {
    riskScore: data.risk_score ?? 0,
    fraudScore: data.fraud_score ?? 0,
    ipRiskScore: data.ip_address?.risk ?? 0,
    recommendations: generateRecommendations(data),
    warnings: data.warnings ?? [],
    insights: {
      ipLocation: {
        country: data.ip_address?.country?.names?.en,
        city: data.ip_address?.city?.names?.en,
        isp: data.ip_address?.traits?.isp,
      },
      emailInfo: {
        isFree: data.email?.is_free,
      },
      addressInfo: {
        isPostalInCity: data.billing_address?.is_postal_in_city,
        shippingToBillingDistance:
          data.shipping_address?.distance_to_billing_address,
      },
    },
  };
}
