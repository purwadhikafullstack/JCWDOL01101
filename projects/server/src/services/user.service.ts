import { DB } from '@/database';
import { CreateUserDto } from '@/dtos/user.dto';
import { HttpException } from '@/exceptions/HttpException';
import { User } from '@/interfaces/user.interface';
import { CartModel } from '@/models/cart.model';
import { CartProductModel } from '@/models/cartProduct.model';
import { ProductModel } from '@/models/product.model';
import { Service } from 'typedi';

@Service()
export class UserService {
  public async createUser(userData: CreateUserDto): Promise<User> {
    const user: User = await DB.User.create({ ...userData });
    return user;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    const findUser: User = await DB.User.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await DB.User.update({ ...userData }, { where: { id: userId } });
    const updatedUser: User = await DB.User.findByPk(userId);
    return updatedUser;
  }

  public async findUserByExternalId(externalId: string): Promise<User> {
    const findUser: User = await DB.User.findOne({
      where: { externalId },
      include: [
        {
          model: CartModel,
          as: 'userCart',
          include: [
            {
              model: CartProductModel,
              as: 'cartProducts',
              include: [
                {
                  model: ProductModel,
                  as: 'product',
                },
              ],
            },
          ],
        },
      ],
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await DB.User.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await DB.User.update({ status: 'DELETED' }, { where: { id: userId } });
    return findUser;
  }
}
