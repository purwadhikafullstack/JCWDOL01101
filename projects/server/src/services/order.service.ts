import { DB } from '@/database';
import { Service } from 'typedi';
import { Order } from '@/interfaces/order.interface';
import { User } from '@/interfaces/user.interface';
import { HttpException } from '@/exceptions/HttpException';
import { Op } from 'sequelize';
import { OrderDetailsModel } from '@/models/orderDetails.model';

@Service()
export class OrderService {
  public async findOrder(userId: number): Promise<Order[]> {
    const findUser: User = await DB.User.findOne({ where: { id: userId, status: 'ACTIVE' } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    const findOrder: Order[] = await DB.Order.findAll({
      where: {
        userId: findUser.id,
        status: {
          [Op.ne]: 'DELIVERED',
        },
      },
      order: [['createdAt', 'DESC']],
    });

    return findOrder;
  }

  public async allowOrder(externalId: string, productId: number): Promise<Order> {
    const findUser: User = await DB.User.findOne({ where: { externalId, status: 'ACTIVE' } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    const findOrder: Order = await DB.Order.findOne({
      where: {
        userId: findUser.id,
        status: 'DELIVERED',
      },
      include: [
        {
          model: OrderDetailsModel,
          as: 'orderDetails',
          where: {
            productId,
          },
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return findOrder;
  }
}
