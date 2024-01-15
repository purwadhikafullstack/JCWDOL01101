import { DB } from '@/database';
import { Product } from '@/interfaces';
import { ImageModel, InventoryModel, ReviewModel, SizeModel, WishlistModel } from '@/models';
import { Op } from 'sequelize';

export async function readProductsByName(s: string): Promise<Product[]> {
  const findProducts: Product[] = await DB.Product.findAll({
    where: { status: 'ACTIVE', ...(s && { name: { [Op.like]: `%${s}%` } }) },
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
  });

  return findProducts || [];
}
