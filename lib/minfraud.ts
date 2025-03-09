/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Client as MinFraudClient } from "@maxmind/minfraud-api-node";

const client = new MinFraudClient(process.env.MINFRAUD_ACCOUNT_ID!, process.env.MINFRAUD_LICENSE_KEY!);

export const minFraud = {
  async score(request: any) { // Change this if you know the expected structure
    try {
      const response = await client.score(request);
      console.log("minFraud response:", response);
      return response
    } catch (error) {
      console.error("Error calling minFraud API:", error);
      throw error;
    }
  },
};
