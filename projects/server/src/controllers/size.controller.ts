import { Size } from '@/interfaces/size.interface';
import { SizeService } from '@/services/size.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class SizeController {
  public size = Container.get(SizeService);

  public getSize = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sizes: Size[] = await this.size.findAllSize();

      res.status(200).json({ data: sizes, message: 'find all sizes' });
    } catch (error) {
      next(error);
    }
  };
}
