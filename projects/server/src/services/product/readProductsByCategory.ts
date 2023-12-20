import { DB } from '@/database';
import { Product, User } from '@/interfaces';
import { ImageModel, InventoryModel, ReviewModel, SizeModel, WishlistModel } from '@/models';
import { HttpException } from '@/exceptions/HttpException';
import { Op } from 'sequelize';

export async function readProductsByCategory(productId: number, categoryId: number, externalId: string, limit: number): Promise<Product[]> {
  let findUser: User | null = null;
  if (externalId) {
    findUser = await DB.User.findOne({ where: { externalId, status: 'ACTIVE' } });
  }
  limit = limit || 12;
  const findProducts: Product[] = await DB.Product.findAll({
    limit,
    where: { categoryId, id: { [Op.ne]: productId }, status: 'ACTIVE' },
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
  });

  return findProducts;
}
