import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';
import { CartContoller } from '@/controllers/cart.controller';

export class CartRoute implements Routes {
  public router = Router();
  public cart = new CartContoller();
  public path = '/v1/cart';
  public path = '/v1/cart';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/product/:productId`, this.cart.getCartProduct);
    this.router.get(`${this.path}/:userId`, this.cart.getCarts);
    this.router.post(`${this.path}`, this.cart.createCart);
    this.router.put(`${this.path}/quantity`, this.cart.changeQuantity);
    this.router.patch(`${this.path}/product/:cartProductId`, this.cart.deleteCartProduct);
    this.router.patch(`${this.path}/:cartId/toggle/selected`, this.cart.toggleAllSelectedCart);
    this.router.patch(`${this.path}/product/:cartProductId/selected`, this.cart.toggleSelectedCart);
    this.router.patch(`${this.path}/products/:cartId`, this.cart.deleteAllCartProduct);
    this.router.patch(`${this.path}/product/:cartProductId/cancel`, this.cart.cancelDeleteCartProduct);
  }
}
