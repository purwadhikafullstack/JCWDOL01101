import { DB } from '@/database';
import { CreateUserDto } from '@/dtos/user.dto';
import { User } from '@/interfaces/user.interface';
import { Service } from 'typedi';

@Service()
export class UserService {
  public async createUser(userDto: CreateUserDto): Promise<User> {
    const user: User = await DB.User.create({ ...userDto });
    return user;
  }
}
