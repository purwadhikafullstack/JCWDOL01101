import { WEBHOOK_SECRET } from '@/config';
import { User } from '@/interfaces/user.interface';
import { UserService } from '@/services/user.service';
import clerkClient, { WebhookEvent } from '@clerk/clerk-sdk-node';
import { Request, Response, NextFunction } from 'express';
import { Webhook } from 'svix';
import Container from 'typedi';

export class UserController {
  user = Container.get(UserService);

  public webhook = async (req: Request, res: Response, next: NextFunction) => {
    if (!WEBHOOK_SECRET) {
      throw new Error('You need a WEBHOOK_SECRET in your .env');
    }
    console.log(WEBHOOK_SECRET);
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
          role: (data.public_metadata.role as string) || 'CUSTOMER',
          status: (data.public_metadata.status as string) || 'ACTIVE',
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
          role: data.public_metadata.role as string,
          status: data.public_metadata.status as string,
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
      const user = await this.user.createAdmin();
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
      const adminData = req.body;
      const updatedAdmin = await this.user.updateAdmin(userId, adminData);
      res.status(200).json({
        data: updatedAdmin,
        message: 'admin edited',
      });
    } catch (err) {
      next(err);
    }
  };

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, s, r } = req.query;
      const { users, totalPages } = await this.user.getAllUser({ page: Number(page), s: s as string, r: r as string });
      res.status(200).json({
        data: {
          users,
          totalPages,
        },
        message: 'get.users',
      });
    } catch (err) {
      next(err);
    }
  };
}
