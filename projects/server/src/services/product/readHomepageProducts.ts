import { ProductQuery } from '@/controllers/product.controller';
import { DB } from '@/database';
import { Product, Category, User } from '@/interfaces';
import { InventoryModel, ImageModel, SizeModel, WishlistModel, ReviewModel } from '@/models';
import { Op, FindOptions } from 'sequelize';
import { queryStringToArray } from './queryStringToArray';

export async function readHomepageProducts({ page, f, category, size, pmin, pmax, externalId, limit }: ProductQuery): Promise<Product[]> {
  let findUser: User | null = null;
  if (externalId) {
    findUser = await DB.User.findOne({ where: { externalId, status: 'ACTIVE' } });
  }
  const findCategory: Category = await DB.Categories.findOne({ paranoid: true, where: { slug: category } });
  const where: { [k: string]: any } = {
    status: 'ACTIVE',
  };

  const sizes = queryStringToArray(size);

  if (pmin && !Number.isNaN(+pmin)) {
    where.price = where.price || {};
    where.price[Op.gte] = Number(pmin);
  }

  if (pmax && !Number.isNaN(+pmax)) {
    where.price = where.price || {};
    where.price[Op.lte] = Number(pmax);
  }

  if (findCategory) {
    where.categoryId = findCategory.id;
  }
  const LIMIT = limit || 10;
  const options: FindOptions = {
    limit: Number(LIMIT),
    offset: (Number(page) - 1) * Number(LIMIT),
    include: [
      {
        model: ImageModel,
        as: 'productImage',
        required: true,
      },
      {
        model: ReviewModel,
        as: 'productReviews',
        attributes: ['rating'],
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
          ...(sizes.length > 0 && {
            sizeId: {
              [Op.in]: sizes,
            },
          }),
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
    where: where,
  };

  switch (f) {
    case 'newest':
      options.order = [['createdAt', 'DESC']];
      break;
    case 'lth':
      options.order = [['price', 'ASC']];
      break;
    case 'htl':
      options.order = [['price', 'DESC']];
      break;
    case 'hs':
      options.order = [[{ model: InventoryModel, as: 'inventory' }, 'sold', 'DESC']];
      break;
    case 'rating':
      options.order = [[{ model: ReviewModel, as: 'productReviews' }, 'rating', 'DESC']];
      break;
    default:
      options.order = [['createdAt', 'DESC']];
      break;
  }

  const products: Product[] = await DB.Product.findAll(options);
  return products;
}
