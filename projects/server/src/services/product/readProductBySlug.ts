import { DB } from '@/database';
import { CategoryModel, ImageModel, InventoryModel, ReviewModel, SizeModel, WishlistModel } from '@/models';
import { Inventory, Product, User } from '@/interfaces';
import { HttpException } from '@/exceptions/HttpException';

export type ProductBySlug = {
  totalStock: number;
  totalSold: number;
  totalStockBySize: Inventory[];
  product: Product;
};

export async function readProductBySlug(slug: string, externalId: string): Promise<ProductBySlug> {
  let findUser: User | null = null;
  if (externalId) {
    findUser = await DB.User.findOne({ where: { externalId, status: 'ACTIVE' } });
  }
  const findProduct: Product = await DB.Product.findOne({
    where: { slug, status: 'ACTIVE' },
    include: [
      {
        model: ReviewModel,
        as: 'productReviews',
        attributes: ['rating'],
      },
      {
        model: CategoryModel,
        as: 'productCategory',
        paranoid: true,
      },
      {
        model: ImageModel,
        as: 'productImage',
      },
      {
        model: InventoryModel,
        as: 'inventory',
        attributes: ['stock', 'sold', 'sizeId'],
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
  });

  if (!findProduct) throw new HttpException(409, "Product doesn't exist");

  const totalStock = await DB.Inventories.sum('stock', { where: { status: 'ACTIVE', productId: findProduct.id } });
  const totalSold = await DB.Inventories.sum('sold', { where: { status: 'ACTIVE', productId: findProduct.id } });
  const totalStockBySize: Inventory[] = await DB.Inventories.findAll({
    where: { status: 'ACTIVE', productId: findProduct.id },
    attributes: ['sizeId', [DB.sequelize.fn('sum', DB.sequelize.col('stock')), 'total']],
    include: [
      {
        model: SizeModel,
        as: 'sizes',
        attributes: ['label'],
      },
    ],
    group: ['sizeId'],
    raw: true,
  });

  return { totalStock, totalSold, totalStockBySize, product: findProduct };
}
