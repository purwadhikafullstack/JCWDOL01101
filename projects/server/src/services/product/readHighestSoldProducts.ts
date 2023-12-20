import { Op } from 'sequelize';
import { DB } from '@/database';
import { Product, User } from '@/interfaces';
import { ImageModel, InventoryModel, ReviewModel, SizeModel, WishlistModel } from '@/models';

export async function readHighestSoldProducts(limit: number, externalId: string | undefined): Promise<Product[]> {
  let findUser: User | null = null;
  if (externalId) {
    findUser = await DB.User.findOne({ where: { externalId, status: 'ACTIVE' } });
  }
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
        where: {
          userId: findUser ? findUser.id : null,
        },
        paranoid: true,
        limit: 1,
      },
    ],
    order: [[{ model: InventoryModel, as: 'inventory' }, 'sold', 'DESC']],
  });

  return highestSellForThisMonth;
}
