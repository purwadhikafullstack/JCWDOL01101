import { DB } from '@/database';
import { Product } from '@/interfaces';
import { CategoryModel, ImageModel, InventoryModel, ProductModel, SizeModel, WarehouseModel, WishlistModel } from '@/models';
import { FindOptions } from 'sequelize';

export async function readProductDashboard(): Promise<Product[]> {
  const page = 1;
  const limit = 2;
  const options: FindOptions<Product> = {
    offset: (page - 1) * limit,
    limit: limit,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: ImageModel,
        as: 'productImage',
      },
      {
        model: CategoryModel,
        as: 'productCategory',
        paranoid: true,
      },
      {
        model: WishlistModel,
        as: 'productWishlist',
        paranoid: true,
        limit: 1,
      },
      {
        model: InventoryModel,
        as: 'inventory',
        attributes: ['id', 'stock', 'productId', 'status', 'sold', 'warehouseId'],
        where: {
          warehouseId: 1,
        },
        required: false,
        include: [
          {
            model: ProductModel,
            as: 'product',
          },
          {
            model: WarehouseModel,
            as: 'warehouse',
          },
          {
            model: SizeModel,
            as: 'sizes',
          },
        ],
      },
    ],
  };

  const [warehouseProducts, totalCount] = await Promise.all([DB.Product.findAll(options), DB.Product.count({ where: options.where })]);

  return warehouseProducts;
}
