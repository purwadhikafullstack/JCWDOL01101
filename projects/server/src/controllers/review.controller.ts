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

  public patchReviewStatus = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const reviewId = Number(req.params.reviewId);
      const status = req.body.status;
      const review: Review = await this.review.changeReviewStatus(reviewId, status);

      res.status(200).json({ data: review, message: 'update review status' });
    } catch (error) {
      next(error);
    }
  };

  public getDashboardReviewProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = Number(req.query.limit);
      const page = Number(req.query.page);
      const productId = Number(req.params.productId);
      const status = String(req.query.status);
      const rating = String(req.query.rating);
      const reviews = await this.review.getReview({ productId, limit, status, rating, page });

      res.status(200).json({ data: reviews, message: 'get reviews by product' });
    } catch (error) {
      next(error);
    }
  };

  public getReviewByProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = Number(req.query.limit);
      const page = Number(req.query.page);
      const productId = Number(req.params.productId);
      const reviews = await this.review.getReviewByProduct(productId, limit, page);

      res.status(200).json({ data: reviews, message: 'get reviews by product' });
    } catch (error) {
      next(error);
    }
  };
}
