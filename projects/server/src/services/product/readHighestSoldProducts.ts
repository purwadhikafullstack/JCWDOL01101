import { Op } from 'sequelize';
import { DB } from '@/database';
import { OrderDetails } from '@/interfaces';
import { InventoryModel, OrderModel, ProductModel } from '@/models';

export async function readHighestSoldProducts(limit: number, externalId: string | undefined): Promise<OrderDetails[]> {
  limit = limit || 3;
  const date = new Date();
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const highestSoldProduct: OrderDetails[] = await DB.OrderDetails.findAll({
    attributes: ['productId', [DB.sequelize.fn('SUM', DB.sequelize.col('quantity')), 'totalQuantity']],
    where: {
      createdAt: {
        [Op.between]: [firstDayOfMonth, lastDayOfMonth],
      },
    },
    include: [
      {
        model: ProductModel,
        as: 'product',
      },
      {
        model: OrderModel,
        as: 'order',
        where: {
          status: 'DELIVERED',
        },
        attributes: [],
      },
    ],
    group: ['productId', 'product.id'],
    order: [[DB.sequelize.literal('totalQuantity'), 'DESC']],
  });

  return highestSoldProduct;
}
