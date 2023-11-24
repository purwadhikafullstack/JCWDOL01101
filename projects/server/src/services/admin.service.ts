import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { User } from '@/interfaces/user.interface';
import { Service } from 'typedi';
import { UserService } from './user.service';
import { Container } from 'typedi';
import clerkClient from '@clerk/clerk-sdk-node';

type EditAdmin = {
  role: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  status: string;
  password: string;
};

@Service()
export class AdminService {
  user = Container.get(UserService);

  public async createAdmin() {
    const random = Math.floor(Math.random() * 1000 + 1);
    const admin = `admin${random}`;
    const createAdmin = await clerkClient.users.createUser({
      emailAddress: [`${admin}@gmail.com`],
      username: admin,
      firstName: 'admin',
      lastName: String(random),
      password: `AdminPassword${random}`,
      publicMetadata: {
        role: 'WAREHOUSE ADMIN',
        status: 'ACTIVE',
      },
    });
    return createAdmin;
  }

  public async updateAdmin(userId: number, data: EditAdmin) {
    const findUser: User = await DB.User.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    if (findUser.role === 'CUSTOMER') throw new HttpException(409, "User isn't an admin");
    const updatedAdmin = await clerkClient.users.updateUser(findUser.externalId, {
      username: data.username,
      firstName: data.firstname,
      lastName: data.lastname,
      password: data.password,
      publicMetadata: {
        role: data.role,
        status: data.status,
      },
    });
    if (data.email === findUser.email) {
      return { email: findUser.email, ...updatedAdmin };
    }
    const updateEmail = await this.user.updateEmail(findUser.externalId, data.email);
    return { email: updateEmail, ...updatedAdmin };
  }

  public async deleteAdmin(userId: number) {
    const findUser: User = await DB.User.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    if (findUser.role === 'CUSTOMER') throw new HttpException(409, "Can't delete customer");

    const deletedAdmin = await clerkClient.users.updateUser(findUser.externalId, {
      publicMetadata: {
        role: findUser.role,
        status: 'DELETED',
      },
    });
    return deletedAdmin;
  }
}
