declare global {
    interface GlobalData {
      id: string; // or number, depending on your use case
      targetUrl: string;
      status: string;
      result: {
        incognito: boolean;
      } // e.g., "pending" | "success" | "error" if the values are limited
    }
  
    // If these are global variables
    const id: GlobalData['id'];
    const targetUrl: GlobalData['targetUrl'];
    const status: GlobalData['status'];
 
    interface MaxMindResponse {
      risk_score?: number;
      fraud_score?: number;
      ip_address?: {
        risk?: number;
        country?: { names?: { en?: string } };
        city?: { names?: { en?: string } };
        traits?: { isp?: string };
      };
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      warnings?: any[]; // If you have a structure for warnings, replace `any[]` with the correct type
      email?: { is_free?: boolean };
      billing_address?: { is_postal_in_city?: boolean };
      shipping_address?: { distance_to_billing_address?: number };
    }
    
  
  
  interface Form {
    name: string;
    data: {
      heading: string;
      subHeading: string;
      input?: {
        name: string;
        placeholder: string;
        type: string;
      }[];
      plans?: {
        name: string;
        monthlyPrice: number;
        yearlyPrice: number;
        icon: string;
      }[];
      addOns?: Addon[];
      summary?: boolean;
    };
  }
  [];
  
  interface Addon {
    name: string;
    description: string;
    monthlyPrice: number;
    yearlyPrice: number;
  }
   }
  export {};