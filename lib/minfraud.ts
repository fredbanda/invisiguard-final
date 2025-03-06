import type { ScoreRequest } from "@maxmind/minfraud-sdk"
import { MinFraudClient } from "@maxmind/minfraud-sdk"

const client = new MinFraudClient({
  accountId: process.env.MINFRAUD_ACCOUNT_ID!,
  licenseKey: process.env.MINFRAUD_LICENSE_KEY!,
})

export const minFraud = {
  async score(request: ScoreRequest) {
    try {
      const response = await client.score(request)
      return response.data
    } catch (error) {
      console.error("Error calling minFraud API:", error)
      throw error
    }
  },
}

