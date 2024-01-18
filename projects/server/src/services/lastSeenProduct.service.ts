import { DB } from '@/database';
import { LastSeenProductDto } from '@/dtos/lastSeenProuct.dto';
import { HttpException } from '@/exceptions/HttpException';
import { LastSeenProducts } from '@/interfaces';
import { ImageModel, InventoryModel, ProductModel, ReviewModel, SizeModel, WishlistModel } from '@/models';
import { Service } from 'typedi';

@Service()
export class LastSeenProductService {
  public async findAllLastSeenProducts(userId: number): Promise<LastSeenProducts[]> {
    const lastSeenProducts: LastSeenProducts[] = await DB.LastSeenProduct.findAll({
      where: {
        userId,
      },
      attributes: ['id'],
      include: [
        {
          model: ProductModel,
          as: 'lastSeenProduct',
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
              where: {
                userId: userId ? userId : null,
              },
              paranoid: true,
              limit: 1,
            },
          ],
        },
      ],
      order: [['timestamp', 'DESC']],
    });
    return lastSeenProducts || [];
  }
  public async createLastSeenProduct(lastSeenProduct: LastSeenProductDto): Promise<LastSeenProducts> {
    const transaction = await DB.sequelize.transaction();
    try {
      let findLastSeenProduct = await DB.LastSeenProduct.findOne({
        where: {
          userId: lastSeenProduct.userId,
          productId: lastSeenProduct.productId,
        },
        transaction,
      });

      if (!findLastSeenProduct) {
        findLastSeenProduct = await DB.LastSeenProduct.create(
          {
            ...lastSeenProduct,
            timestamp: new Date(),
          },
          { transaction },
        );
      } else {
        findLastSeenProduct.timestamp = new Date();
        await findLastSeenProduct.save({ transaction });
      }

      const userLastSeenProductCount = await DB.LastSeenProduct.count({
        where: {
          userId: lastSeenProduct.userId,
        },
        transaction,
      });

      if (userLastSeenProductCount > 10) {
        const oldestEntry = await DB.LastSeenProduct.findOne({
          where: {
            userId: lastSeenProduct.userId,
          },
          order: [['timestamp', 'ASC']],
          transaction,
        });

        await oldestEntry.destroy({ transaction });
      }

      await transaction.commit();
      return findLastSeenProduct;
    } catch (err) {
      await transaction.rollback();
      throw new HttpException(500, 'Something went wrong');
    }
  }
}
