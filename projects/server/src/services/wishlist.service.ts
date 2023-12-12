import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { User } from '@/interfaces/user.interface';
import { Wishlist } from '@/interfaces/wishlist.interface';
import { InventoryModel } from '@/models/inventory.model';
import { ProductModel } from '@/models/product.model';
import { Service } from 'typedi';

@Service()
export class WishlistService {
  public async toggleWishlist(externalId: string, productId: number): Promise<Wishlist> {
    const [findUser, findProduct] = await Promise.all([
      DB.User.findOne({ where: { externalId, status: 'ACTIVE' } }),
      DB.Product.findOne({
        where: {
          id: productId,
          status: 'ACTIVE',
        },
      }),
    ]);

    if (!findUser) throw new HttpException(409, "User doesn't exist");
    if (!findProduct) throw new HttpException(409, "Product doesn't exist");

    let wishlist = await DB.WishList.findOne({ where: { productId, userId: findUser.id, deletedAt: null } });

    if (wishlist) {
      await wishlist.destroy();
    } else {
      await DB.WishList.restore({ where: { productId, userId: findUser.id } });
      wishlist =
        (await DB.WishList.findOne({ where: { productId, userId: findUser.id, deletedAt: null } })) ||
        (await DB.WishList.create({ productId, userId: findUser.id }));
    }

    return wishlist;
  }

  public async removeWishlist(externalId: string, productId: number): Promise<Wishlist> {
    const [findUser, findProduct] = await Promise.all([
      DB.User.findOne({ where: { externalId, status: 'ACTIVE' } }),
      DB.Product.findOne({
        where: {
          id: productId,
          status: 'ACTIVE',
        },
      }),
    ]);

    if (!findUser) throw new HttpException(409, "User doesn't exist");
    if (!findProduct) throw new HttpException(409, "Product doesn't exist");

    const findWishlist = await DB.WishList.findOne({ paranoid: true, where: { productId, userId: findUser.id } });
    if (!findWishlist) throw new HttpException(409, "Wishlist doens't exist");

    await findWishlist.destroy();
    return findWishlist;
  }

  public async getWishlist(externalId: string, limit: number, page?: number): Promise<any> {
    limit = limit || 5;
    const findUser: User = await DB.User.findOne({ where: { externalId, status: 'ACTIVE' } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const totalWishlist: number = await DB.WishList.count({ where: { userId: findUser.id } });
    const wishlist: Wishlist[] = await DB.WishList.findAll({
      limit,
      offset: (Number(page) - 1) * limit,
      order: [['createdAt', 'DESC']],
      paranoid: true,
      where: { userId: findUser.id },
      include: [
        {
          model: ProductModel,
          as: 'productWishlist',
          include: [
            {
              model: InventoryModel,
              as: 'inventory',
              attributes: ['stock', 'sold'],
            },
          ],
        },
      ],
    });
    return {
      wishlist,
      totalWishlist,
    };
  }
}
