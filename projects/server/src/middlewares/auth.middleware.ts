import { RequireAuthProp } from '@clerk/clerk-sdk-node';
import { NextFunction, Request, Response } from 'express';

export const AdminAuth = (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
  try {
    // const userRole = req.auth;
    console.log(req.auth);
    // if (userRole) {
    //   next();
    // }
    next();
  } catch (error) {
    next(error);
  }
};
