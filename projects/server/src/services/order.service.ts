import { DB } from '@/database';
import { Service } from 'typedi';
import { GetFilterOrder, Order } from '@/interfaces/order.interface';
import { User } from '@/interfaces/user.interface';
import { HttpException } from '@/exceptions/HttpException';
import { FindOptions, Op } from 'sequelize';
import { OrderDetailsModel } from '@/models/orderDetails.model';
import { WarehouseModel } from '@/models/warehouse.model';
import { UserModel } from '@/models/user.model';

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

  public async getAllOrder({
    page,
    s,
    order,
    limit,
    filter,
    externalId,
    warehouse,
    status,
  }: GetFilterOrder): Promise<{ orders: Order[]; totalPages: number }> {
    const findUser: User = await DB.User.findOne({ where: { externalId } });
    if (!findUser) throw new HttpException(409, "user doesn't exist");

    const findWarehouse = await DB.Warehouses.findOne({ where: { name: warehouse } });
    if (!findWarehouse) throw new HttpException(409, "warehouse doesn't exist");
    const LIMIT = Number(limit) || 10;
    const offset = (page - 1) * LIMIT;
    const options: FindOptions<Order> = {
      offset,
      limit: LIMIT,
      where: {
        warehouseId: findWarehouse.id,
        ...(status && { status }),
      },
      ...(order && {
        order: filter === 'user' ? [[{ model: UserModel, as: 'userOrder' }, 'firstname', order]] : [[filter, order]],
      }),
      include: [
        {
          model: WarehouseModel,
          as: 'warehouseOrder',
          attributes: ['name'],
        },
        {
          model: UserModel,
          as: 'userOrder',
          attributes: ['firstname', 'lastname'],
        },
      ],
    };

    if (s) {
      options.where = {
        [Op.or]: [
          { invoice: { [Op.like]: `%${s}%` } },
          { '$warehouseOrder.name$': { [Op.like]: `%${s}%` } },
          { '$userOrder.firstname$': { [Op.like]: `%${s}%` } },
          { '$userOrder.lastname$': { [Op.like]: `%${s}%` } },
        ],
      };
    }

    const allOrder = await DB.Order.findAll(options);
    const totalCount = await DB.Order.count(options);
    const totalPages = Math.ceil(totalCount / LIMIT);

    return { totalPages: totalPages, orders: allOrder };
  }
}
