import { DB } from '@/database';
import { Service } from 'typedi';
import { GetFilterOrder, Order } from '@/interfaces/order.interface';
import { User } from '@/interfaces/user.interface';
import { HttpException } from '@/exceptions/HttpException';
import { FindOptions, Op } from 'sequelize';
import { OrderDetailsModel } from '@/models/orderDetails.model';
import { WarehouseModel } from '@/models/warehouse.model';
import { UserModel } from '@/models/user.model';
import { ImageModel, ProductModel } from '@/models';
import { PaymentDetailsModel } from '@/models/paymentDetails.model';

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

  public async findCurrentUserOrder({
    externalId,
    page,
    status,
    q,
    limit,
  }: {
    externalId: string;
    page: number;
    status: string | string[];
    q: string;
    limit: number;
  }): Promise<{ orders: Order[]; totalPages: number }> {
    const findUser: User = await DB.User.findOne({ where: { externalId, status: 'ACTIVE' } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    limit = limit || 8;
    const offset = (page - 1) * limit;
    if (status === 'UNSUCCESSFUL') {
      status = ['CANCELED', 'FAILED', 'REJECTED'];
    }
    const options: FindOptions<Order> = {
      limit,
      offset,
      where: {
        userId: findUser.id,
        ...(status && status !== 'ALL' && { status }),
      },
      include: [
        {
          model: OrderDetailsModel,
          as: 'orderDetails',
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
        {
          model: PaymentDetailsModel,
          as: 'paymentDetails',
          attributes: ['virtualAccount', 'paymentDate', 'method','expiredDate'],
        },
      ],
      order: [['createdAt', 'DESC']],
    };

    if (q && q.length > 0) {
      options.where = {
        ...options.where,
        [Op.or]: [{ invoice: { [Op.like]: `%${q}%` } }],
      };
    }

    const findOrder: Order[] = await DB.Order.findAll(options);
    const count = await DB.Order.count({ where: options.where });
    const totalPages = Math.ceil(count / limit);
    return { orders: findOrder, totalPages };
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
    to,
    from,
  }: GetFilterOrder): Promise<{ orders: Order[]; totalPages: number; totalSuccess: number; totalPending:number; totalFailed:number; totalOngoing:number }> {
    const findUser: User = await DB.User.findOne({ where: { externalId } });
    if (!findUser) throw new HttpException(409, "user doesn't exist");
    let findWarehouse;
    if (warehouse !== 'All') {
      findWarehouse = await DB.Warehouses.findOne({ where: { name: warehouse } });
      if (!findWarehouse) throw new HttpException(409, "warehouse doesn't exist");
    }
    if (status === 'UNSUCCESSFUL') {
      status = ['CANCELED', 'FAILED', 'REJECTED'];
    }
    const LIMIT = Number(limit) || 10;
    const offset = (page - 1) * LIMIT;
    const options: FindOptions<Order> = {
      offset,
      limit: LIMIT,
      where: {
        status: { [Op.ne]: 'PENDING' },
        ...(warehouse !== 'All' && { warehouseId: findWarehouse.id }),
        ...(status && status !== 'ALL' && { status }),
        createdAt: {
          [Op.between]: [new Date(from), new Date(to)],
        },
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

    let totalSuccess = 0;
    let totalPending = 0;
    let totalCanceled = 0;
    let totalRejected = 0;
    let totalOngoing = 0;
    let totalFailed = 0;

    const optionsCount: FindOptions<Order> = {
      where: {
        ...(warehouse !== 'All' && { warehouseId: findWarehouse.id }),
        ...(status && { status }),
        createdAt: {
          [Op.between]: [new Date(from), new Date(to)],
        },
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
    const allOrderCcount = await DB.Order.findAll(optionsCount);

    allOrderCcount.forEach(order => {
      if (order.status === 'SUCCESS') totalSuccess += order.totalPrice;
      else if (order.status === 'PENDING') totalPending += order.totalPrice;
      else if (order.status === 'CANCELED') totalCanceled += order.totalPrice;
      else if (order.status === 'REJECTED') totalRejected += order.totalPrice;
      else if (order.status === 'DELIVERED' || order.status === 'SHIPPED' || order.status === 'WAITING' || order.status === 'PROCESS')
        totalOngoing += order.totalPrice;
      totalFailed = totalCanceled+totalRejected
    });

    return { totalPages: totalPages, orders: allOrder, totalSuccess, totalPending, totalFailed, totalOngoing };
  }
}
