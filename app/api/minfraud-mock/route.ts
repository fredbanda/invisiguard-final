import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Get form data from request
    const formData = await request.json()

    // Create a mock response
    const mockResponse = {
      risk_score: Math.random() * 100,
      fraud_score: Math.random() * 100,
      ip_address: {
        risk: Math.random() * 100,
        country: {
          names: {
            en: "United States",
          },
        },
        city: {
          names: {
            en: "New York",
          },
        },
        traits: {
          isp: "Example ISP",
        },
      },
      email: {
        is_free: Math.random() > 0.5,
      },
      billing_address: {
        is_postal_in_city: Math.random() > 0.5,
      },
      shipping_address: {
        distance_to_billing_address: Math.random() * 2000,
      },
    }

    // Process and return the response
    return NextResponse.json(processMinFraudResponse(mockResponse))
  } catch (error) {
    console.error("Error in mock minfraud API route:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: (error as Error).message,
      },
      { status: 500 },
    )
  }
}

// Process the response from MaxMind
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

