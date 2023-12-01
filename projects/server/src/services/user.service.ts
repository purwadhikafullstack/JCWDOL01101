import { DB } from '@/database';
import { CreateUserDto } from '@/dtos/user.dto';
import { HttpException } from '@/exceptions/HttpException';
import { GetFilterUser, User } from '@/interfaces/user.interface';
import { CartModel } from '@/models/cart.model';
import { CartProductModel } from '@/models/cartProduct.model';
import { ProductModel } from '@/models/product.model';
import { Service } from 'typedi';
import { Op } from 'sequelize';
import clerkClient from '@clerk/clerk-sdk-node';
import { CLERK_SECRET_KEY } from '@/config';
import axios from 'axios';
import { ImageModel } from '@/models/image.model';

type UserOptions = {
  offset: number;
  limit: number;
  where: {
    status: {
      [Op.not]: string;
    };
    name?: {
      [Op.like]: string;
    };
    role: string;
  };
  order?: Array<[string, string]>;
};

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
          where: { status: 'ACTIVE' },
          required: false,
          include: [
            {
              model: CartProductModel,
              as: 'cartProducts',
              where: {
                status: 'ACTIVE',
              },
              required: false,
              include: [
                {
                  model: ProductModel,
                  as: 'product',
                  include: [
                    {
                      model: ImageModel,
                      as: 'productImage',
                    },
                  ],
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

  public async findUserById(userId: number): Promise<User> {
    const user = await DB.User.findOne({ where: { id: userId } });
    return user;
  }

  public async findAllUser(): Promise<User[]> {
    const allUser = await DB.User.findAll({ where: { role: 'CUSTOMER' } });
    return allUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await DB.User.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await DB.User.update({ status: 'DELETED' }, { where: { id: userId } });
    return findUser;
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

  public async updateEmail(externalId: string, email: string) {
    const oldEmailId = (await clerkClient.users.getUser(externalId)).primaryEmailAddressId;
    const createEmail = await axios.post(
      `https://api.clerk.com/v1/email_addresses/`,
      {
        user_id: externalId,
        email_address: email as string,
        verify: true,
        primary: false,
      },
      {
        headers: {
          Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        },
      },
    );

    const updateEmail = await axios.patch(
      `https://api.clerk.com/v1/email_addresses/${createEmail.data.id}`,
      {
        verified: true,
        primary: true,
      },
      {
        headers: {
          Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        },
      },
    );

    await axios.delete(`https://api.clerk.com/v1/email_addresses/${oldEmailId}`, {
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
      },
    });

    return {
      emailId: updateEmail.data.id,
      email: updateEmail.data.email_address,
    };
  }
}
