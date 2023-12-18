import { Op } from 'sequelize';
import { DB } from '@/database';
import { Product } from '@/interfaces';
import { ImageModel, InventoryModel, ReviewModel, SizeModel, WishlistModel } from '@/models';

export async function readHighestSoldProducts(limit: number): Promise<Product[]> {
  limit = limit || 3;
  const date = new Date();
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const highestSellForThisMonth: Product[] = await DB.Product.findAll({
    limit,
    where: {
      status: 'ACTIVE',
      createdAt: {
        [Op.gte]: firstDayOfMonth,
        [Op.lte]: lastDayOfMonth,
      },
    },
    include: [
      {
        model: ReviewModel,
        as: 'productReviews',
        attributes: ['rating'],
      },
      {
        model: ImageModel,
        as: 'productImage',
      },
      {
        model: InventoryModel,
        as: 'inventory',
        include: [
          {
            model: SizeModel,
            as: 'sizes',
          },
        ],
        attributes: ['stock', 'sold'],
        where: {
          status: 'ACTIVE',
        },
      },
      {
        model: WishlistModel,
        as: 'productWishlist',
        paranoid: true,
        limit: 1,
      },
    ],
    order: [[{ model: InventoryModel, as: 'inventory' }, 'sold', 'DESC']],
  });

  return highestSellForThisMonth;
}
