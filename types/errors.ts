// types/errors.ts
export class AuthenticationError extends Error {
    constructor(message = 'User not authenticated') {
      super(message);
      this.name = 'AuthenticationError';
    }
  }
  
  export class FingerprintError extends Error {
    constructor(message = 'Fingerprint error') {
      super(message);
      this.name = 'FingerprintError';
    }
  }