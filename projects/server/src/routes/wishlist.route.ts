import { WishlistController } from '@/controllers/wishlist.controller';
import { Routes } from '@/interfaces/routes.interface';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { Router } from 'express';

export class WishlistRoute implements Routes {
  public router = Router();
  public wishlist = new WishlistController();
  public path = '/v1/wishlist';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/:productId`, ClerkExpressRequireAuth(), this.wishlist.toggleWishlist);
    this.router.delete(`${this.path}/:productId`, ClerkExpressRequireAuth(), this.wishlist.deleteWishlist);
    this.router.get(`${this.path}`, ClerkExpressRequireAuth(), this.wishlist.getWishlist);
  }
}
