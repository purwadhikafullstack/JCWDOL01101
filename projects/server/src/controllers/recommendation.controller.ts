import { RecommendationService } from '@/services/recommendation.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class RecommendationController {
  public recommendation = Container.get(RecommendationService);

  public getRecommendation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);
      const recommendation = await this.recommendation.getRecommendation(userId);

      res.status(200).json({
        data: recommendation,
        message: 'get recommendation',
      });
    } catch (error) {
      next(error);
    }
  };
}
