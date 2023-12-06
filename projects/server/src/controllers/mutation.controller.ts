import { MutationDto } from '@/dtos/mutation.dto';
import { Mutation } from '@/interfaces/mutation.interface';
import { MutationService } from '@/services/mutation.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class MutationController {
  mutation = Container.get(MutationService);

  public getProductsByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = String(req.query.search);
      const findProduct = await this.mutation.getProductByName(search);

      res.status(200).json({
        message: 'get.product',
        data: findProduct,
      });
    } catch (err) {
      next(err);
    }
  };

  public createMutation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mutationData: MutationDto = req.body;
      const createdMutation: Mutation = await this.mutation.createMutation({ ...mutationData });

      res.status(200).json({
        message: 'post.mutation',
        data: createdMutation,
      });
    } catch (err) {
      next(err);
    }
  };
}
