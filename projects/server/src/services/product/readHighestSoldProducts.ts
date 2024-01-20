import { DB } from '@/database';
import { Product } from '@/interfaces';
import { ImageModel, InventoryModel } from '@/models';

export async function readHighestSoldProducts(limit: number): Promise<Product[]> {
  limit = limit || 3;

  const products: Product[] = await DB.Product.findAll({
    limit,
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
