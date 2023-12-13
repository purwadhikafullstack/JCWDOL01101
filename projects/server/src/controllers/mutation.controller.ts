import { MutationDto } from '@/dtos/mutation.dto';
import { Mutation } from '@/interfaces/mutation.interface';
import { MutationService } from '@/services/mutation.service';
import { RequireAuthProp } from '@clerk/clerk-sdk-node';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class MutationController {
  mutation = Container.get(MutationService);

  public getMutations = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const { page, s, order, filter, limit, warehouse, manage } = req.query;

      const { mutations, totalPages } = await this.mutation.getAllMutation({
        s: String(s),
        order: String(order),
        limit: Number(limit),
        filter: String(filter),
        page: Number(page),
        warehouse: String(warehouse),
        externalId: req.auth.userId,
        manage: String(manage),
      });
      res.status(200).json({
        data: {
          mutations,
          totalPages,
        },
        message: 'get.warehouseMutations',
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

  public cancelMutation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mutationId = Number(req.params.mutationId);
      const cancelMutation: Mutation = await this.mutation.cancelMutation(mutationId);

      res.status(200).json({
        message: 'patch.mutation',
        data: cancelMutation,
      });
    } catch (err) {
      next(err);
    }
  };

  public rejectMutation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mutationId = Number(req.params.mutationId);
      const name = String(req.body.name);
      const notes = String(req.body.notes);
      const rejectMutation: Mutation = await this.mutation.rejectMutation(mutationId, name, notes);

      res.status(200).json({
        message: 'patch.mutation',
        data: rejectMutation,
      });
    } catch (err) {
      next(err);
    }
  };

  public acceptMutation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mutationId = Number(req.params.mutationId);
      const name = String(req.body.name);
      const notes = String(req.body.notes);
      const acceptMutation = await this.mutation.acceptMutation(mutationId, name, notes);

      res.status(200).json({
        message: 'patch.mutation',
        data: acceptMutation,
      });
    } catch (err) {
      next(err);
    }
  };
}
