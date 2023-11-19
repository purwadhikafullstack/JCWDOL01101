import { DB } from '@/database';
import { CreateUserDto } from '@/dtos/user.dto';
import { HttpException } from '@/exceptions/HttpException';
import { User } from '@/interfaces/user.interface';
import { Service } from 'typedi';
import { Op } from 'sequelize';
// import { v4 as uuidv4 } from 'uuid';
import clerkClient from '@clerk/clerk-sdk-node';
import { CreateAdminDto } from '@/dtos/admin.dto';

type UserOptions = {
  offset: number;
  limit: number;
  where: {
    status: string;
    name?: {
      [Op.like]: string;
    };
    role: string;
  };
};

@Service()
export class UserService {
  public async createUser(userData: CreateUserDto): Promise<User> {
    const user: User = await DB.User.create({ ...userData });
    return user;
  }

  public async createAdmin() {
    const random = Math.floor(Math.random() * 1000 + 1);
    const adminUsername = `admin${random}`;
    const admin = await clerkClient.users.createUser({
      emailAddress: [`${adminUsername}@mail.com`],
      username: adminUsername,
      password: `AdminPassword${random}`,
      publicMetadata: {
        role: 'WAREHOUSE',
        status: 'ACTIVE',
      },
    });
    return admin;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    const findUser: User = await DB.User.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await DB.User.update({ ...userData }, { where: { id: userId } });
    const updatedUser: User = await DB.User.findByPk(userId);
    return updatedUser;
  }

  public async updateAdmin(userId: number, adminData: CreateAdminDto) {
    const findUser: User = await DB.User.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const updatedAdmin = await clerkClient.users.updateUser(findUser.externalId, adminData);
    return updatedAdmin;
  }

  public async findUserByExternalId(externalId: string): Promise<User> {
    const findUser: User = await DB.User.findOne({ where: { externalId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await DB.User.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await DB.User.update({ status: 'DELETED' }, { where: { id: userId } });
    return findUser;
  }

  // public async deleteAdmin(externalId: string, adminData: CreateAdminDto) {
  //   const deletedUser = await clerkClient.users.updateUser(externalId, {
  //     ...adminData,
  //     publicMetadata: {
  //       role: adminData.role,
  //       status: 'DELETED',
  //     },
  //   });
  //   return deletedUser;
  // }

  public async findUserById(userId: number): Promise<User> {
    const user = await DB.User.findOne({ where: { id: userId } });
    return user;
  }

  public async findAllUser(): Promise<User[]> {
    const allUser = await DB.User.findAll({ where: { role: 'CUSTOMER' } });
    return allUser;
  }

  public async getAllUser({ page, s, r }: { page: number; s: string; r: string }): Promise<{ users: User[]; totalPages: number }> {
    const PER_PAGE = 10;
    const offset = (page - 1) * PER_PAGE;
    const options: UserOptions = {
      offset,
      limit: PER_PAGE,
      where: {
        status: 'ACTIVE',
        role: r,
        ...(s && {
          [Op.or]: [{ firstName: { [Op.like]: `%${s}%` } }, { lastName: { [Op.like]: `%${s}%` } }],
        }),
      },
    };

    const [findAllUser, totalCount] = await Promise.all([DB.User.findAll(options), DB.User.count(options)]);
    const totalPages = Math.ceil(totalCount / PER_PAGE);

    return { totalPages, users: findAllUser };
  }
}
