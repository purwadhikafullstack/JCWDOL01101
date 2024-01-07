import { DB } from '@/database';
import { GetFilterProduct, Product, User } from '@/interfaces';
import { CategoryModel, ImageModel, InventoryModel, SizeModel, WarehouseModel, WishlistModel } from '@/models';
import { HttpException } from '@/exceptions/HttpException';
import { FindOptions, Op } from 'sequelize';
import { queryStringToArray } from './queryStringToArray';

export async function readProducts({
  s,
  size,
  page,
  order,
  limit,
  filter,
  status,
  category,
  warehouse,
  externalId,
}: GetFilterProduct): Promise<{ products: Product[]; totalPages: number }> {
  limit = limit || 10;
  page = page || 1;
  status = status || 'ACTIVE';

  const findUser: User = await DB.User.findOne({ where: { externalId } });
  if (!findUser) throw new HttpException(409, "user doesn't exist");
  const role = findUser.role;
  const where =
    role === 'ADMIN'
      ? {
          ...(warehouse && { id: Number(warehouse) }),
        }
      : role === 'WAREHOUSE ADMIN'
      ? {
          userId: findUser.id,
        }
      : {};

  const categories = queryStringToArray(category);
  const sizes = queryStringToArray(size);
  const options: FindOptions<Product> = {
    offset: (page - 1) * limit,
    limit: limit,
    where: {
      ...(s && { name: { [Op.like]: `%${s}%` } }),
      ...(categories.length > 0 && {
        categoryId: {
          [Op.in]: categories,
        },
      }),
    },
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
          status,
          ...(warehouse && { warehouseId: Number(warehouse) }),
          ...(sizes.length > 0 && {
            sizeId: {
              [Op.in]: sizes,
            },
          }),
        },
        required: false,
        include: [
          {
            where,
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

  if (order) {
    options.order = filter === 'stock' || filter === 'sold' ? [[{ model: InventoryModel, as: 'inventory' }, filter, order]] : [[filter, order]];
  }

  const [warehouseProducts, totalCount] = await Promise.all([DB.Product.findAll(options), DB.Product.count({ where: options.where })]);
  const totalPages = Math.ceil(totalCount / limit);

  return { totalPages: totalPages, products: warehouseProducts };
}
