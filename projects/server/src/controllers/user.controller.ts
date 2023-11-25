import { WEBHOOK_SECRET } from '@/config';
import { GetFilterUser, User } from '@/interfaces/user.interface';
import { Role, Status } from '@/interfaces/';
import { UserService } from '@/services/user.service';
import { AdminService } from '@/services/admin.service';
import clerkClient, { WebhookEvent } from '@clerk/clerk-sdk-node';
import { Request, Response, NextFunction } from 'express';
import { Webhook } from 'svix';
import Container from 'typedi';

export class UserController {
  user = Container.get(UserService);
  admin = Container.get(AdminService);

  public getUserByExternalId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const externalId = req.params.externalId as string;
      const findUser: User = await this.user.findUserByExternalId(externalId);
      res.status(200).json({
        data: findUser,
        message: 'get.user',
      });
    } catch (err) {
      next(err);
    }
  };

  public webhook = async (req: Request, res: Response, next: NextFunction) => {
    if (!WEBHOOK_SECRET) {
      throw new Error('You need a WEBHOOK_SECRET in your .env');
    }
    const headers = req.headers;
    const payload = req.body;

    const svix_id = headers['svix-id'] as string;
    const svix_timestamp = headers['svix-timestamp'] as string;
    const svix_signature = headers['svix-signature'] as string;

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({ message: 'Error occure -- no svix headers' });
    }

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(JSON.stringify(payload), {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;

      const eventType = evt.type;
      if (eventType === 'user.created') {
        const data = evt.data;
        await this.user.createUser({
          email: data.email_addresses[0].email_address,
          externalId: data.id,
          firstname: data.first_name,
          lastname: data.last_name,
          username: data.username,
          imageUrl: data.image_url,
          role: data.public_metadata.role as Role,
          status: data.public_metadata.status as Status,
        });
        if (data.id) {
          await clerkClient.users.updateUser(evt.data.id, {
            publicMetadata: {
              role: (data.public_metadata.role as string) || 'CUSTOMER',
              status: 'ACTIVE',
            },
          });
        }
      } else if (eventType === 'user.updated') {
        const data = evt.data;
        const findUser: User = await this.user.findUserByExternalId(data.id);
        await this.user.updateUser(findUser.id, {
          email: data.email_addresses[0].email_address,
          externalId: data.id,
          firstname: data.first_name,
          lastname: data.last_name,
          username: data.username,
          imageUrl: data.image_url,
          role: data.public_metadata.role as Role,
          status: data.public_metadata.status as Status,
        });
      } else if (eventType === 'user.deleted') {
        const data = evt.data;
        const findUser: User = await this.user.findUserByExternalId(data.id);
        await this.user.deleteUser(findUser.id);
      }

      res.status(200).json({
        eventType,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  public createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.admin.createAdmin();
      res.status(200).json({
        data: user,
        message: 'warehouse admin created',
      });
    } catch (err) {
      next(err);
    }
  };

  public manageAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);
      const data = req.body;
      const updatedAdmin = await this.admin.updateAdmin(userId, data);
      res.status(200).json({
        data: updatedAdmin,
        message: 'admin edited',
      });
    } catch (err) {
      next(err);
    }
  };

  public deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);
      const deletedAdmin = await this.admin.deleteAdmin(userId);
      res.status(200).json({
        data: deletedAdmin,
        message: 'admin deleted',
      });
    } catch (err) {
      next(err);
    }
  };

  public getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const user = await this.user.findUserById(Number(userId));
      res.status(200).json({
        data: user,
        message: 'get user',
      });
    } catch (err) {
      next(err);
    }
  };

  public getUsers = async (req: Request<{}, {}, {}, GetFilterUser>, res: Response, next: NextFunction) => {
    try {
      const { page, s, r, order, filter } = req.query;
      const { users, totalPages } = await this.user.getAllUser({
        page: Number(page),
        s,
        r,
        order,
        filter,
      });
      res.status(200).json({
        data: {
          users,
          totalPages,
        },
        message: 'get users',
      });
    } catch (err) {
      next(err);
    }
  };
}
