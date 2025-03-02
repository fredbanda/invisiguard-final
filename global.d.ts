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