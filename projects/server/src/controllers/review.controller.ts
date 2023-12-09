import { Review } from '@/interfaces/review.interface';
import { ReviewService } from '@/services/review.service';
import { RequireAuthProp } from '@clerk/clerk-sdk-node';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class ReviewController {
  public review = Container.get(ReviewService);

  public createReview = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const externalId = req.auth.userId;
      const reviewData = req.body;
      const review: Review = await this.review.createReview(externalId, reviewData);

      res.status(200).json({ data: review, message: 'create.review' });
    } catch (error) {
      next(error);
    }
  };

  public getReviewByProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = Number(req.query.limit);
      const page = Number(req.query.page);
      const productId = Number(req.params.productId);
      const reviews: Review[] = await this.review.getReviewByProduct(productId, limit, page);

      res.status(200).json({ data: reviews, message: 'get reviews by product' });
    } catch (error) {
      next(error);
    }
  };
}
