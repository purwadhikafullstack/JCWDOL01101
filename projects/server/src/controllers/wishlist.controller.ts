import { Wishlist } from '@/interfaces/wishlist.interface';
import { WishlistService } from '@/services/wishlist.service';
import { RequireAuthProp } from '@clerk/clerk-sdk-node';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class WishlistController {
  public wishlist = Container.get(WishlistService);

  public toggleWishlist = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const externalId = req.auth.userId;
      const productId = Number(req.params.productId);
      const wishlist: Wishlist = await this.wishlist.toggleWishlist(externalId, productId);

      res.status(200).json({ data: wishlist, message: 'toogle wishlist' });
    } catch (error) {
      next(error);
    }
  };

  public deleteWishlist = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const externalId = req.auth.userId;
      const productId = Number(req.params.productId);
      const wishlist: Wishlist = await this.wishlist.removeWishlist(externalId, productId);

      res.status(200).json({ data: wishlist, message: 'remove wishlist' });
    } catch (error) {
      next(error);
    }
  };

  public getWishlist = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const limit = Number(req.query.limit);
      const page = Number(req.query.page);
      const externalId = req.auth.userId;
      const reviews: Wishlist[] = await this.wishlist.getWishlist(externalId, limit, page);

      res.status(200).json({ data: reviews, message: 'get reviews by product' });
    } catch (error) {
      next(error);
    }
  };
}
