import { ClerkExpressRequireAuth, RequireAuthProp } from '@clerk/clerk-sdk-node';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '@/services/user.service';
import Container from 'typedi';

export class AuthMiddleware {
  user = Container.get(UserService);

  public PrivateAuth = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.userId;
      const user = await this.user.findUserByExternalId(userId);
      if (user.role !== 'CUSTOMER') next();
    } catch (error) {
      next(error);
    }
  };

  public ClerkAuth = ClerkExpressRequireAuth();

  public AdminAuth = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.userId;
      const user = await this.user.findUserByExternalId(userId);
      if (user.role === 'ADMIN') next();
    } catch (error) {
      next(error);
    }
  };
}
