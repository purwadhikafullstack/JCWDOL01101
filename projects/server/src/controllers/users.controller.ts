import { User } from '@/interfaces/users.interface';
import { UserService } from '@/services/users.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class UserController {
  public user = Container.get(UserService);

  public getUserbyId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const findUserData: User = await this.user.findUserById(userId);

      res.status(200).json({ data: findUserData, message: 'find user data' });
    } catch (error) {
      next(error);
    }
  };

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: User[] = await this.user.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'find all user' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const createUserData: User = await this.user.createUser(userData);

      res.status(201).json({ data: createUserData, message: 'user created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const userData: User = req.body;
      const updateUserData: User = await this.user.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'user updated' });
    } catch (error) {
      next(error);
    }
  };
}
