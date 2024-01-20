import { DB } from '@/database';
import { Service } from 'typedi';
import { User, Order, Category, Product, TopCategory, Inventory } from '@/interfaces';
import { HttpException } from '@/exceptions/HttpException';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { OrderDetailsModel } from '@/models/orderDetails.model';
import { WarehouseModel } from '@/models/warehouse.model';
import { UserModel } from '@/models/user.model';
import { CategoryModel, ImageModel, InventoryModel, ProductModel } from '@/models';
import { PaymentDetailsModel } from '@/models/paymentDetails.model';
import { GetFilterOrder } from '@/interfaces/order.interface';

@Service()
export class OrderService {
  private async getUserWithExternalId(externalId: string): Promise<User> {
    const user: User = await DB.User.findOne({
      where: {
        externalId,
        status: 'ACTIVE',
      },
      include: [
        {
          model: WarehouseModel,
          as: 'warehouse',
          attributes: ['id'],
        },
      ],
    });
    if (!user) {
      throw new HttpException(404, 'User not found');
    }
    return user;
  }
  public async getKpi(externalId: string): Promise<any> {
    const user = await this.getUserWithExternalId(externalId);
    const role = user.role;
    const date = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const firstDayOfLastMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(date.getFullYear(), date.getMonth(), 0);
    const thisMonthWhere: WhereOptions<Order> = {
      status: {
        [Op.or]: ['SUCCESS', 'DELIVERED'],
      },
      deletedAt: null,
      createdAt: {
        [Op.between]: [firstDayOfMonth, lastDayOfMonth],
      },
    };
    const lastMonthWhere: WhereOptions<Order> = {
      status: {
        [Op.or]: ['SUCCESS', 'DELIVERED'],
      },
      deletedAt: null,
      createdAt: {
        [Op.between]: [firstDayOfLastMonth, lastDayOfLastMonth],
      },
    };

    if (role === 'WAREHOUSE ADMIN') {
      thisMonthWhere.warehouseId = user.warehouse.id;
      lastMonthWhere.warehouseId = user.warehouse.id;
    }

    const [thisMonthOrders, lastMonthOrders]: [Order[], Order[]] = await Promise.all([
      DB.Order.findAll({
        where: thisMonthWhere,
        include: [
          {
            model: OrderDetailsModel,
            as: 'orderDetails',
          },
        ],
      }),
      DB.Order.findAll({
        where: lastMonthWhere,
        include: [
          {
            model: OrderDetailsModel,
            as: 'orderDetails',
          },
        ],
      }),
    ]);

    const totalPrice = thisMonthOrders.reduce((acc, order) => acc + order.totalPrice, 0);
    const lastMonthTotalPrice = lastMonthOrders.reduce((acc, order) => acc + order.totalPrice, 0);
    const deltaTotalPrice = lastMonthTotalPrice > 0 ? ((totalPrice - lastMonthTotalPrice) / lastMonthTotalPrice) * 100 : 0;

    const averageOrderValue =
      thisMonthOrders.length > 0
        ? thisMonthOrders.reduce((acc, order) => acc + order.totalPrice / order.orderDetails.length, 0) / thisMonthOrders.length
        : 0;
    const averageOrderValueLastMonth =
      lastMonthOrders.length > 0
        ? lastMonthOrders.reduce((acc, order) => acc + order.totalPrice / order.orderDetails.length, 0) / lastMonthOrders.length
        : 0;
    const deltaAverageOrderValue =
      averageOrderValueLastMonth > 0 ? ((averageOrderValue - averageOrderValueLastMonth) / averageOrderValueLastMonth) * 100 : 0;

    const totalSuccessOrdersThisMonth = thisMonthOrders.length;
    const totalSuccessOrdersLastMonth = lastMonthOrders.length;
    const deltaOrders =
      totalSuccessOrdersLastMonth > 0 ? ((totalSuccessOrdersThisMonth - totalSuccessOrdersLastMonth) / totalSuccessOrdersLastMonth) * 100 : 0;
    const [deliveredOrSuccessOrdersThisMonth, deliveredOrSuccessOrdersLastMonth, totalOrdersThisMonth, totalOrdersLastMonth] = await Promise.all([
      await DB.Order.count({
        where: thisMonthWhere,
      }),
      await DB.Order.count({
        where: lastMonthWhere,
      }),
      await DB.Order.count({
        where: {
          ...(role === 'WAREHOUSE ADMIN' && { warehouseId: user.warehouse.id }),
          createdAt: {
            [Op.between]: [firstDayOfMonth, lastDayOfMonth],
          },
          deletedAt: null,
        },
      }),
      await DB.Order.count({
        where: {
          ...(role === 'WAREHOUSE ADMIN' && { warehouseId: user.warehouse.id }),
          createdAt: {
            [Op.between]: [firstDayOfLastMonth, lastDayOfLastMonth],
          },
          deletedAt: null,
        },
      }),
    ]);
    const convertionRate = totalOrdersThisMonth > 0 ? (deliveredOrSuccessOrdersThisMonth / totalOrdersThisMonth) * 100 : 0;
    const convertionRateLastMonth = totalOrdersLastMonth > 0 ? (deliveredOrSuccessOrdersLastMonth / totalOrdersLastMonth) * 100 : 0;
    const deltaConvertionRate = convertionRateLastMonth > 0 ? ((convertionRate - convertionRateLastMonth) / convertionRateLastMonth) * 100 : 0;

    return {
      kpi: [
        {
          title: 'Total Sales',
          metric: totalPrice,
          delta: deltaTotalPrice,
        },
        {
          title: 'Avg. Order Value',
          metric: averageOrderValue,
          delta: deltaAverageOrderValue,
        },
        {
          title: 'Total Orders',
          metric: totalOrdersThisMonth,
          delta: deltaOrders,
        },
        {
          title: 'Conversion Rate',
          metric: convertionRate,
          delta: deltaConvertionRate,
        },
      ],
    };
  }

  public async getRevenue(externalId: string): Promise<any> {
    const user = await this.getUserWithExternalId(externalId);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const orders = await DB.Order.findAll({
      where: {
        ...(user.role === 'WAREHOUSE ADMIN' && { warehouseId: user.warehouse.id }),
        status: {
          [Op.or]: ['SUCCESS', 'DELIVERED'],
        },
        deletedAt: null,
        createdAt: {
          [Op.gte]: oneYearAgo,
        },
      },
      attributes: [
        [DB.sequelize.fn('year', DB.sequelize.col('created_at')), 'year'],
        [DB.sequelize.fn('month', DB.sequelize.col('created_at')), 'month'],
        [DB.sequelize.fn('sum', DB.sequelize.col('total_price')), 'totalPrice'],
      ],
      group: ['year', 'month'],
      order: [DB.sequelize.literal('year ASC'), DB.sequelize.literal('month ASC')],
    });

    return orders;
  }

  public async getTopCategory(externalId: string): Promise<TopCategory[]> {
    const user = await this.getUserWithExternalId(externalId);
    const inventory: Inventory[] = await DB.Inventories.findAll({
      where: {
        ...(user.role === 'WAREHOUSE ADMIN' && { warehouseId: user.warehouse.id }),
        sold: {
          [Op.gt]: 0,
        },
      },
      include: [
        {
          model: ProductModel,
          as: 'product',
          where: {},
          include: [
            {
              model: CategoryModel,
              as: 'productCategory',
            },
          ],
        },
      ],
    });

    const categoryTotals = inventory.reduce((acc, inv) => {
      const categoryName = inv.product.productCategory.name;
      acc[categoryName] = (acc[categoryName] || 0) + inv.sold;
      return acc;
    }, {});

    let topCategory: TopCategory[] = Object.entries(categoryTotals).map(([title, total]: [string, number]) => ({ title, total }));

    topCategory.sort((a, b) => {
      if (a.title === 'Others') return 1;
      if (b.title === 'Others') return -1;
      return b.total - a.total;
    });

    const top3 = topCategory.slice(0, 3);
    const othersTotal = topCategory.slice(3).reduce((acc, category) => acc + category.total, 0);
    top3.push({ title: 'Others', total: othersTotal });

    return top3;
  }

  public async getHighestSellingProduct(externalId: string): Promise<Product[]> {
    const user = await this.getUserWithExternalId(externalId);
    const products: Product[] = await DB.Product.findAll({
      limit: 5,
      where: {
        status: 'ACTIVE',
      },
      include: [
        {
          model: ImageModel,
          as: 'productImage',
          required: true,
        },
        {
          model: InventoryModel,
          as: 'inventory',
          attributes: ['stock', 'sold'],
          where: {
            status: 'ACTIVE',
            sold: {
              [Op.gt]: 0,
            },
            ...(user.role === 'WAREHOUSE ADMIN' && { warehouseId: user.warehouse.id }),
          },
        },
      ],
      order: [
        [
          DB.sequelize.literal(`(
      SELECT SUM(inventory.sold) FROM inventories AS inventory
      WHERE inventory.product_id = ProductModel.id AND inventory.status = 'ACTIVE'
    )`),
          'DESC',
        ],
      ],
    });

    return products;
  }

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
          attributes: ['virtualAccount', 'paymentDate', 'method', 'expiredDate'],
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

  public async getAllOrder({ page, s, order, limit, filter, externalId, warehouse, status, to, from }: GetFilterOrder): Promise<{
    orders: Order[];
    totalPages: number;
    totalSuccess: number;
    totalPending: number;
    totalFailed: number;
    totalOngoing: number;
  }> {
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
    });
    totalFailed = totalCanceled + totalRejected;

    return { totalPages: totalPages, orders: allOrder, totalSuccess, totalPending, totalFailed, totalOngoing };
  }
}
