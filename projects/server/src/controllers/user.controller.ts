import { WEBHOOK_SECRET } from '@/config';
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
    } catch (error) {
      next(error);
    }

    const eventType = evt.type;
    if (eventType === 'user.created') {
      const data = evt.data;
      await this.user.createUser({
        email: data.email_addresses[0].email_address,
        externalId: data.id,
        role: (data.public_metadata.role as string) || 'user',
        status: (data.public_metadata.role as string) || 'active',
        firstname: data.first_name,
        lastname: data.last_name,
        username: data.username,
        imageUrl: data.image_url,
      });
      await clerkClient.users.updateUser(evt.data.id, {
        publicMetadata: {
          role: 'user',
          status: 'active',
        },
      });
    }

    return res.status(200).json({
      success: true,
    });
  };

  public getUserbyId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const findUserData = await this.user.findUserById(userId);

      res.status(200).json({ data: findUserData, message: 'find user data' });
    } catch (error) {
      next(error);
    }
  };

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData = await this.user.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'find all user' });
    } catch (error) {
      next(error);
    }
  };

  public manageUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const userData = req.body;
      const manageUserData = await this.user.manageUser(userId, userData);

      res.status(200).json({ data: manageUserData, message: 'user updated' });
    } catch (error) {
      next(error);
    }
  };
}
