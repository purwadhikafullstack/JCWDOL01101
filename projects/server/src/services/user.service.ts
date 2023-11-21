import { DB } from '@/database';
import { CreateUserDto } from '@/dtos/user.dto';
import { HttpException } from '@/exceptions/HttpException';
import { GetFilterUser, User } from '@/interfaces/user.interface';
import { Service } from 'typedi';
import { Op } from 'sequelize';
import clerkClient from '@clerk/clerk-sdk-node';

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
  order?: Array<[string, string]>;
};

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
export class UserService {
  public async createUser(userData: CreateUserDto): Promise<User> {
    const user: User = await DB.User.create({ ...userData });
    return user;
  }

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
        role: 'WAREHOUSE',
        status: 'ACTIVE',
      },
    });
    return createAdmin;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    const findUser: User = await DB.User.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await DB.User.update({ ...userData }, { where: { id: userId } });
    const updatedUser: User = await DB.User.findByPk(userId);
    return updatedUser;
  }

  public async updateAdmin(userId: number, data: EditAdmin) {
    const findUser: User = await DB.User.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    if (findUser.role === 'CUSTOMER') throw new HttpException(409, "User isn't an admin");

    const updatedAdmin = await clerkClient.users.updateUser(findUser.externalId, {
      emailAddress: [`${data.email}`],
      username: data.username,
      firstName: data.firstname,
      lastName: data.lastname,
      password: data.password,
      publicMetadata: {
        role: data.role,
        status: data.status,
      },
    });
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

  public async findUserById(userId: number): Promise<User> {
    const user = await DB.User.findOne({ where: { id: userId } });
    return user;
  }

  public async findAllUser(): Promise<User[]> {
    const allUser = await DB.User.findAll({ where: { role: 'CUSTOMER' } });
    return allUser;
  }

  public async getAllUser({ page, s, r, order, filter }: GetFilterUser): Promise<{ users: User[]; totalPages: number }> {
    const PER_PAGE = 10;
    const offset = (page - 1) * PER_PAGE;
    const options: UserOptions = {
      offset,
      limit: PER_PAGE,
      where: {
        status: {
          [Op.not]: 'DELETED',
        },
        role: r,
        ...(s && {
          [Op.or]: [{ firstName: { [Op.like]: `%${s}%` } }, { lastName: { [Op.like]: `%${s}%` } }],
        }),
      },
      ...(!!order && { order: [[filter, order]] }),
    };

    const [findAllUser, totalCount] = await Promise.all([DB.User.findAll(options), DB.User.count(options)]);
    const totalPages = Math.ceil(totalCount / PER_PAGE);

    return { totalPages, users: findAllUser };
  }
}
