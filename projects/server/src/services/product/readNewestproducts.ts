import { DB } from '@/database';
import { Product, User } from '@/interfaces';
import { CategoryModel, ImageModel, InventoryModel, ReviewModel, SizeModel, WishlistModel } from '@/models';

export async function readNewestProducts(externalId: string | undefined): Promise<Product[]> {
  let findUser: User | null = null;
  if (externalId) {
    findUser = await DB.User.findOne({ where: { externalId, status: 'ACTIVE' } });
  }
  const findAllProduct: Product[] = await DB.Product.findAll({
    limit: 12,
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
        model: CategoryModel,
        as: 'productCategory',
      },
      {
        model: InventoryModel,
        as: 'inventory',
        attributes: ['stock', 'sold'],
        include: [
          {
            model: SizeModel,
            as: 'sizes',
          },
        ],
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
        required: false,
        paranoid: true,
        limit: 1,
      },
    ],
    where: {
      status: 'ACTIVE',
    },
    order: [['createdAt', 'DESC']],
  });

  return findAllProduct;
}
