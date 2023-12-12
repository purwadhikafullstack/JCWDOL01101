import { DB } from '@/database';
import { ReviewDto } from '@/dtos/review.dto';
import { HttpException } from '@/exceptions/HttpException';
import { Status } from '@/interfaces';
import { Product } from '@/interfaces/product.interface';
import { Review } from '@/interfaces/review.interface';
import { User } from '@/interfaces/user.interface';
import { id } from '@/utils/badWord';
import Filter from 'bad-words';
import { FindOptions, Op } from 'sequelize';
import { Service } from 'typedi';

type GetReview = {
  page: number;
  limit: number;
  status: string;
  rating: string;
  productId: number;
};
@Service()
export class ReviewService {
  public async createReview(externalId: string, reviewData: ReviewDto): Promise<Review> {
    const findUser: User = await DB.User.findOne({ where: { externalId, status: 'ACTIVE' } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const findProduct: Product = await DB.Product.findByPk(reviewData.productId);
    if (!findProduct) throw new HttpException(409, "Product doesn't exist");
    const filter = new Filter();
    filter.addWords(...id);
    const cleanComment = filter.clean(reviewData.comment);

    const review: Review = await DB.Review.create({ ...reviewData, comment: cleanComment, userId: findUser.id });
    return review;
  }

  public async changeReviewStatus(reviewId: number, status: Status) {
    const findReview: Review = await DB.Review.findByPk(reviewId);
    if (!findReview) throw new HttpException(409, "Review doesn't exist");
    if (status !== findReview.status) {
      await DB.Review.update({ status }, { where: { id: reviewId } });
    }

    const updatedReview: Review = await DB.Review.findByPk(reviewId);
    return updatedReview;
  }

  public async getReviewByProduct(productId: number, limit: number, page?: number): Promise<any> {
    limit = limit || 3;
    const findProduct: Product = await DB.Product.findByPk(productId);
    if (!findProduct) throw new HttpException(409, "Product doesn't exist");
    const totalReviews: number = await DB.Review.count({ where: { productId, status: 'ACTIVE' } });
    const averageRating: number = (await DB.Review.sum('rating', { where: { productId, status: 'ACTIVE' } })) / totalReviews;

    const ratingCounts = await DB.sequelize.query(
      `SELECT rating, COUNT(*) as count FROM reviews WHERE product_id = :productId AND status = 'ACTIVE' GROUP BY rating`,
      {
        replacements: { productId },
        type: DB.Sequelize.QueryTypes.SELECT,
      },
    );

    const options: FindOptions<Review> = {
      limit,
      where: {
        productId,
        status: 'ACTIVE',
      },
      order: [['createdAt', 'DESC']],
    };
    if (page) {
      options.offset = (Number(page) - 1) * limit;
    }
    const reviews: Review[] = await DB.Review.findAll(options);
    return {
      totalReviews,
      averageRating,
      ratingCounts,
      reviews,
    };
  }

  public async getReview({ limit, page, status, rating, productId }: GetReview): Promise<any> {
    limit = limit || 10;
    const findProduct: Product = await DB.Product.findByPk(productId);
    if (!findProduct) throw new HttpException(409, "Product doesn't exist");
    const totalReviews: number = await DB.Review.count({ where: { productId } });
    const averageRating: number = (await DB.Review.sum('rating', { where: { productId } })) / totalReviews;

    const ratingCounts = await DB.sequelize.query(`SELECT rating, COUNT(*) as count FROM reviews WHERE product_id = :productId  GROUP BY rating`, {
      replacements: { productId },
      type: DB.Sequelize.QueryTypes.SELECT,
    });

    const statuses = status.length > 0 ? status.trim().split(',') : [];
    const ratings =
      rating.length > 0
        ? rating
            .trim()
            .split(',')
            .map(r => +r)
        : [];
    const options: FindOptions<Review> = {
      offset: (Number(page) - 1) * limit,
      limit,
      where: {
        productId,
        ...(statuses.length > 0 && {
          status: {
            [Op.in]: statuses,
          },
        }),
        ...(ratings.length > 0 && {
          rating: {
            [Op.in]: ratings,
          },
        }),
      },
      order: [['createdAt', 'DESC']],
    };

    const totalCount = await DB.Review.count({ where: options.where });
    const totalPages = Math.ceil(totalCount / limit);
    const reviews: Review[] = await DB.Review.findAll(options);
    return {
      totalPages,
      totalReviews,
      averageRating,
      ratingCounts,
      reviews,
    };
  }
}
