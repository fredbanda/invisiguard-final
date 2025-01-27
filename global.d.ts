declare global {
    interface GlobalData {
      id: string; // or number, depending on your use case
      targetUrl: string;
      status: string; // e.g., "pending" | "success" | "error" if the values are limited
    }
  
    // If these are global variables
    const id: GlobalData['id'];
    const targetUrl: GlobalData['targetUrl'];
    const status: GlobalData['status'];
  }
  
  export {};
  