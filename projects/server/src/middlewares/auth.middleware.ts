import { ClerkExpressRequireAuth, RequireAuthProp } from '@clerk/clerk-sdk-node';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/exceptions/HttpException';

export const AuthMiddleware = () => {
  return ClerkExpressRequireAuth();
};

export const AdminAuth = (error: HttpException, req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
  try {
    const userRole = req.auth.userId;
    if (userRole === 'admin') {
      next();
    } else {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};
