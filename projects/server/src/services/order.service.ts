import { DB } from '@/database';
import Container, { Service } from 'typedi';
import { GetFilterOrder, Order } from '@/interfaces/order.interface';
import { User } from '@/interfaces/user.interface';
import { HttpException } from '@/exceptions/HttpException';
import { FindOptions, Op } from 'sequelize';
import { OrderDetailsModel } from '@/models/orderDetails.model';
import { WarehouseModel } from '@/models/warehouse.model';
import { UserModel } from '@/models/user.model';
import { OrderDetails, Warehouse } from '@/interfaces';
import { findWarehousesAndDistributeStock } from '@/utils/closestWarehouse';
import { WarehouseService } from './warehouse.service';

@Service()
export class OrderService {
  warehouse = Container.get(WarehouseService);

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
    let findWarehouse;
    if (warehouse !== 'All') {
      findWarehouse = await DB.Warehouses.findOne({ where: { name: warehouse } });
      if (!findWarehouse) throw new HttpException(409, "warehouse doesn't exist");
    }
    const LIMIT = Number(limit) || 10;
    const offset = (page - 1) * LIMIT;
    const options: FindOptions<Order> = {
      offset,
      limit: LIMIT,
      where: {
        ...(warehouse !== 'All' && { warehouseId: findWarehouse.id }),
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

  public async acceptOrder(orderId: number) {
    const findOrder: Order = await DB.Order.findByPk(orderId);
    if (!findOrder) throw new HttpException(409, "Order doesn't exist");
    if (findOrder.status !== 'WAITING') throw new HttpException(409, "Can't accept order");
    const currentWarehouse: Warehouse = await this.warehouse.findWarehouseById(findOrder.warehouseId);
    const orderDetails: OrderDetails[] = await DB.OrderDetails.findAll({ where: { orderId } });
    if (!orderDetails || orderDetails.length === 0) throw new HttpException(409, "Order doesn't exist");

    await findWarehousesAndDistributeStock(orderDetails, currentWarehouse);
    await DB.Order.update({ status: 'PROCESS' }, { where: { id: orderId } });
    const updatedOrder = await DB.Mutation.findByPk(orderId);
    return updatedOrder;
  }

  public async rejectOrder(orderId: number) {
    const findOrder: Order = await DB.Order.findByPk(orderId);
    if (!findOrder) throw new HttpException(409, "Order doesn't exist");
    if (findOrder.status !== 'WAITING') throw new HttpException(409, "Can't reject order");

    await DB.Order.update({ status: 'REJECTED' }, { where: { id: orderId } });
    const updatedOrder = await DB.Mutation.findByPk(orderId);
    return updatedOrder;
  }
}
