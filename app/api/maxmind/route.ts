import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// MaxMind API endpoints
const MINFRAUD_SCORE_URL = "https://minfraud.maxmind.com/minfraud/v2.0/score"
const MINFRAUD_INSIGHTS_URL = "https://minfraud.maxmind.com/minfraud/v2.0/insights"

// MD5 hash function
function md5(input: string): string {
  return crypto.createHash("md5").update(input).digest("hex")
}

export async function POST(request: NextRequest) {
  try {
    // Get credentials from environment variables
    const accountId = process.env.MINFRAUD_ACCOUNT_ID || process.env.MAXMIND_ACCOUNT_ID
    const licenseKey = process.env.MINFRAUD_LICENSE_KEY || process.env.MAXMIND_LICENSE_KEY

    if (!accountId || !licenseKey) {
      return NextResponse.json({ error: "MaxMind credentials not configured" }, { status: 500 })
    }

    // Get form data from request
    const formData = await request.json()

    // Transform form data to MaxMind API format
    const minfraudData = transformFormDataToMinFraudFormat(formData)

    // Determine which endpoint to use (insights provides more data but costs more credits)
    const endpoint = formData.useInsights ? MINFRAUD_INSIGHTS_URL : MINFRAUD_SCORE_URL

    // Make request to MaxMind API
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountId}:${licenseKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(minfraudData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("MaxMind API error:", errorText)
      return NextResponse.json({ error: "Error from MaxMind API", details: errorText }, { status: response.status })
    }

    const data = await response.json()

    // Process and return the response
    return NextResponse.json(processMinFraudResponse(data))
  } catch (error) {
    console.error("Error in minfraud API route:", error)
    return NextResponse.json({ error: "Internal server error", details: (error as Error).message }, { status: 500 })
  }
}

// Transform form data to the format expected by MaxMind's API
function transformFormDataToMinFraudFormat(formData: any) {
  const result: any = {
    device: {},
    event: {},
    account: {},
    email: {},
    billing: {},
    shipping: {},
    payment: {},
    credit_card: {},
    order: {},
  }

  // Device information
  if (formData.ipAddress) {
    result.device.ip_address = formData.ipAddress
  }
  if (formData.userAgent) {
    result.device.user_agent = formData.userAgent
  }
  if (formData.sessionId) {
    result.device.session_id = formData.sessionId
  }

  // Event information
  if (formData.shopId) {
    result.event.shop_id = formData.shopId
  }
  if (formData.transactionId) {
    result.event.transaction_id = formData.transactionId
  }
  if (formData.transactionType) {
    result.event.type = formData.transactionType
  }

  // Account information
  if (formData.username) {
    result.account.username_md5 = md5(formData.username)
  }
  if (formData.accountCreatedAt) {
    result.account.created_at = new Date(formData.accountCreatedAt).toISOString()
  }

  // Email information
  if (formData.userEmail) {
    result.email.address = formData.userEmail
    // You can also hash the email for privacy
    result.email.domain = formData.userEmail.split("@")[1]
  }

  // Billing information
  if (formData.billingFirstName || formData.billingLastName) {
    result.billing.first_name = formData.billingFirstName
    result.billing.last_name = formData.billingLastName
  }
  if (formData.billingAddress1) {
    result.billing.address = formData.billingAddress1
  }
  if (formData.billingAddress2) {
    result.billing.address_2 = formData.billingAddress2
  }
  if (formData.billingCity) {
    result.billing.city = formData.billingCity
  }
  if (formData.billingRegion) {
    result.billing.region = formData.billingRegion
  }
  if (formData.billingPostal) {
    result.billing.postal = formData.billingPostal
  }
  if (formData.billingCountry) {
    result.billing.country = formData.billingCountry
  }
  if (formData.billingPhone) {
    result.billing.phone_number = formData.billingPhone
  }

  // Shipping information
  if (formData.shippingFirstName || formData.shippingLastName) {
    result.shipping.first_name = formData.shippingFirstName
    result.shipping.last_name = formData.shippingLastName
  }
  if (formData.shippingAddress1) {
    result.shipping.address = formData.shippingAddress1
  }
  if (formData.shippingAddress2) {
    result.shipping.address_2 = formData.shippingAddress2
  }
  if (formData.shippingCity) {
    result.shipping.city = formData.shippingCity
  }
  if (formData.shippingRegion) {
    result.shipping.region = formData.shippingRegion
  }
  if (formData.shippingPostal) {
    result.shipping.postal = formData.shippingPostal
  }
  if (formData.shippingCountry) {
    result.shipping.country = formData.shippingCountry
  }

  // Payment information
  if (formData.transactionAmount && formData.transactionCurrency) {
    result.order.amount = Number.parseFloat(formData.transactionAmount)
    result.order.currency = formData.transactionCurrency
  }

  // Credit card information
  if (formData.cardBin) {
    result.credit_card.issuer_id_number = formData.cardBin
  }
  if (formData.cardLast4) {
    result.credit_card.last_4_digits = formData.cardLast4
  }
  if (formData.avsResult) {
    result.credit_card.avs_result = formData.avsResult
  }
  if (formData.cvvResult) {
    result.credit_card.cvv_result = formData.cvvResult
  }

  // Remove empty objects
  Object.keys(result).forEach((key) => {
    if (Object.keys(result[key]).length === 0) {
      delete result[key]
    }
  })

  return result
}

// Process the response from MaxMind
function processMinFraudResponse(data: any) {
  const result = {
    riskScore: data.risk_score || 0,
    fraudScore: data.fraud_score || 0,
    ipRiskScore: data.ip_address?.risk || 0,
    recommendations: [] as string[],
    warnings: data.warnings || [],
    insights: {},
  }

  // Generate recommendations based on scores
  if (result.riskScore > 75) {
    result.recommendations.push("Manually review this transaction")
    result.recommendations.push("Consider requesting additional verification")
  } else if (result.riskScore > 50) {
    result.recommendations.push("Verify billing phone number")
    result.recommendations.push("Confirm shipping address details")
  }

  if (data.ip_address?.risk > 80) {
    result.recommendations.push("IP address has high risk - consider additional verification")
  }

  if (data.email?.is_free) {
    result.recommendations.push("Email is from a free provider - verify email ownership")
  }

  if (data.billing_address?.is_postal_in_city === false) {
    result.recommendations.push("Postal code does not match city - verify billing address")
  }

  if (data.shipping_address?.distance_to_billing_address && data.shipping_address.distance_to_billing_address > 1000) {
    result.recommendations.push("Large distance between billing and shipping addresses")
  }

  // Add insights if available
  if (data.ip_address) {
    result.insights = {
      ...result.insights,
      ipLocation: {
        country: data.ip_address.country?.names?.en,
        city: data.ip_address.city?.names?.en,
        isp: data.ip_address.traits?.isp,
      },
    }
  }

  // If no recommendations were generated, add a default one
  if (result.recommendations.length === 0) {
    if (result.riskScore < 10) {
      result.recommendations.push("Transaction appears to be low risk")
    } else {
      result.recommendations.push("Review transaction details for any unusual patterns")
    }
  }

  return result
}

