import { DB } from '@/database';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/HttpException';
import { User } from '@/interfaces/users.interface';

@Service()
export class UserService {
  public async findUserById(userId: number): Promise<User> {
    const user = await DB.Users.findOne({ where: { id: userId } });
    return user;
  }

  public async findAllUser(): Promise<User[]> {
    const allUser = await DB.Users.findAll();
    return allUser;
  }

  public async createUser(userData: User): Promise<User> {
    const findUser: User = await DB.Users.findOne({ where: { name: userData.name } });
    if (findUser) throw new HttpException(409, 'User already exist');

    const createUserData: User = await DB.Users.create({ ...userData });
    return createUserData;
  }

  public async updateUser(userId: number, userData: User): Promise<User> {
    const findUser: User = await DB.Users.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await DB.Users.update({ ...userData }, { where: { id: userId } });

    const updateUser: User = await DB.Users.findByPk(userId);
    return updateUser;
  }
}
