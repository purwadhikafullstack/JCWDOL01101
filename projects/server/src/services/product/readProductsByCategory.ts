import { DB } from '@/database';
import { Product } from '@/interfaces';
import { ImageModel, InventoryModel, ReviewModel, SizeModel, WishlistModel } from '@/models';
import { HttpException } from '@/exceptions/HttpException';

export async function readProductsByCategory(categoryId: number, limit: number): Promise<Product[]> {
  limit = limit || 12;
  const findProducts: Product[] = await DB.Product.findAll({
    limit,
    where: { categoryId, status: 'ACTIVE' },
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
  if (!findProducts || findProducts.length === 0) throw new HttpException(409, "Products doesn't exist");

  return findProducts;
}
