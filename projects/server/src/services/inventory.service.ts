import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { Inventory } from '@/interfaces/inventory.interface';
import { Product } from '@/interfaces/product.interface';
import { User } from '@/interfaces/user.interface';
import { CategoryModel } from '@/models/category.model';
import { ImageModel } from '@/models/image.model';
import { ProductModel } from '@/models/product.model';
import { SizeModel } from '@/models/size.model';
import { WarehouseModel } from '@/models/warehouse.model';
import { WishlistModel } from '@/models/wishlist.model';
import { Op, FindOptions } from 'sequelize';
import { Service } from 'typedi';

export interface GetFilterProduct {
  s: string;
  size: string;
  page: number;
  filter: string;
  order: string;
  limit: number;
  externalId: string;
  warehouse: string;
  category: string;
}
@Service()
export class InventoryService {
  public async findInventories({
    s,
    page,
    size,
    order,
    limit,
    filter,
    category,
    warehouse,
    externalId,
  }: GetFilterProduct): Promise<{ inventories: Inventory[]; totalPages: number }> {
    page = page || 1;
    const findUser: User = await DB.User.findOne({ where: { externalId } });
    if (!findUser) throw new HttpException(409, "user doesn't exist");
    const role = findUser.role;
    const where =
      role === 'ADMIN'
        ? {
            ...(warehouse && { name: { [Op.like]: `%${warehouse}%` } }),
          }
        : role === 'WAREHOUSE ADMIN'
        ? {
            userId: findUser.id,
          }
        : {};

    const LIMIT = Number(limit) || 10;
    const offset = (page - 1) * LIMIT;
    const categories =
      category.length > 0
        ? category
            .trim()
            .split(',')
            .map(c => +c)
        : [];
    const sizes =
      size.length > 0
        ? size
            .trim()
            .split(',')
            .map(s => +s)
        : [];
    const options: FindOptions<Product> = {
      offset,
      limit: LIMIT,
      where: {
        ...(sizes.length > 0 && {
          sizeId: {
            [Op.in]: sizes,
          },
        }),
      },
      order: [['createdAt', 'DESC']],
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
        {
          model: ProductModel,
          as: 'product',
          where: {
            ...(s && { name: { [Op.like]: `%${s}%` } }),
            ...(categories.length > 0 && {
              categoryId: {
                [Op.in]: categories,
              },
            }),
          },

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
          ],
        },
      ],
    };

    // if (order) {
    //   options.order = filter === 'stock' || filter === 'sold' ? [[{ model: InventoryModel, as: 'inventory' }, filter, order]] : [[filter, order]];
    // }

    const warehouseProducts = await DB.Inventories.findAll(options);
    const totalCount = await DB.Inventories.count({ where: options.where });
    const totalPages = Math.ceil(totalCount / LIMIT);

    return { totalPages: totalPages, inventories: warehouseProducts };
  }
}
