import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { LastSeenProducts } from '@/interfaces';
import { CategoryModel, ImageModel, InventoryModel, ProductModel, ReviewModel, SizeModel, UserModel, WishlistModel } from '@/models';
import { Service } from 'typedi';

@Service()
export class RecommendationService {
  public async getRecommendation(userId: number) {
    const RECOMMENDED_LIMIT = 12;
    const LAST_SEEN_LIMIT = 10;
    const RATING_TRESHOLD = 4.0;
    const transaction = await DB.sequelize.transaction();
    try {
      const lastSeen: LastSeenProducts[] = await DB.LastSeenProduct.findAll({
        where: { userId },
        limit: LAST_SEEN_LIMIT,
        include: [
          {
            model: ProductModel,
            as: 'lastSeenProduct',
          },
        ],
        transaction,
      });

      const similarUsers: LastSeenProducts[] = await DB.LastSeenProduct.findAll({
        where: {
          productId: lastSeen.map(ls => ls.productId),
        },
        include: [
          {
            model: UserModel,
            as: 'userLastSeen',
          },
        ],
        transaction,
      });

      const topRated = await DB.Product.findAll({
        include: [
          {
            model: ReviewModel,
            as: 'productReviews',
            where: {
              rating: {
                [DB.Sequelize.Op.gt]: RATING_TRESHOLD,
              },
              userId: similarUsers.map(su => su.userId),
            },
          },
        ],
        transaction,
      });

      const recommendedProduct = await DB.Product.findAll({
        limit: RECOMMENDED_LIMIT,
        where: {
          id: [...new Set([...topRated.map(p => p.id), ...lastSeen.map(ls => ls.productId)])],
        },
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
              userId,
            },
            required: false,
            paranoid: true,
            limit: 1,
          },
        ],
        order: [[{ model: ReviewModel, as: 'productReviews' }, 'rating', 'DESC']],
        transaction,
      });

      await transaction.commit();
      return recommendedProduct;
    } catch (err) {
      await transaction.rollback();
      throw new HttpException(500, 'Something Went Wrong');
    }
  }
}
