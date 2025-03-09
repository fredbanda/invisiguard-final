/* eslint-disable @typescript-eslint/no-unused-vars */

function generateRecommendations(data: MaxMindResponse): string[] {
  console.log(generateRecommendations);
  
    const recommendations: string[] = [];
  
    if (data.risk_score !== undefined && data.risk_score > 75) {
      recommendations.push("Manually review this transaction", "Consider requesting additional verification");
    } else if (data.risk_score !== undefined && data.risk_score > 50) {
      recommendations.push("Verify billing phone number", "Confirm shipping address details");
    }
  
    if (data.ip_address?.risk !== undefined && data.ip_address.risk > 80) {
      recommendations.push("IP address has high risk - consider additional verification");
    }
  
    if (data.email?.is_free) {
      recommendations.push("Email is from a free provider - verify email ownership");
    }
  
    if (data.billing_address?.is_postal_in_city === false) {
      recommendations.push("Postal code does not match city - verify billing address");
    }
  
    if (data.shipping_address?.distance_to_billing_address !== undefined && 
        data.shipping_address.distance_to_billing_address > 1000) {
      recommendations.push("Large distance between billing and shipping addresses");
    }
  
    // Default recommendation if no flags are triggered
    if (recommendations.length === 0) {
      recommendations.push(data.risk_score !== undefined && data.risk_score < 10 
        ? "Transaction appears to be low risk" 
        : "Review transaction details for any unusual patterns");
    }
  
    return recommendations;
    
    
  }
  