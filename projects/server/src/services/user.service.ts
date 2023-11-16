import { DB } from '@/database';
import { CreateUserDto } from '@/dtos/user.dto';
import { User } from '@/interfaces/user.interface';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/HttpException';

@Service()
export class UserService {
  public async createUser(userDto: CreateUserDto): Promise<User> {
    const user: User = await DB.User.create({ ...userDto });
    return user;
  }

  public async findUserById(userId: number): Promise<User> {
    const user = await DB.User.findOne({ where: { id: userId } });
    return user;
  }

  public async findAllUser(): Promise<User[]> {
    const allUser = await DB.User.findAll();
    return allUser;
  }

  public async manageUser(userId: number, userData: User): Promise<User> {
    const findUser: User = await DB.User.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await DB.User.update({ ...userData }, { where: { id: userId } });

    const updateUser: User = await DB.User.findByPk(userId);
    return updateUser;
  }
}
