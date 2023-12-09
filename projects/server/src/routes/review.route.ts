import { ReviewController } from '@/controllers/review.controller';
import { Routes } from '@/interfaces/routes.interface';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { Router } from 'express';

export class ReviewRoute implements Routes {
  public router = Router();
  public review = new ReviewController();
  public path = '/v1/reviews';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, ClerkExpressRequireAuth(), this.review.createReview);
    this.router.get(`${this.path}/product/:productId`, this.review.getReviewByProduct);
  }
}
