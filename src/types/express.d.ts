import 'express';

declare global {
  namespace Express {
    interface User {
      email: string;
      displayName: string;
      avatar: string;
      googleId: string;
    }
  }
}