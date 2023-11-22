import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';
import { CartContoller } from '@/controllers/cart.controller';

export class CartRoute implements Routes {
  public router = Router();
  public cart = new CartContoller();
  public path = '/api/cart';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/product/:productId`, this.cart.getCartProduct);
    this.router.get(`${this.path}/:userId`, this.cart.getCarts);
    this.router.post(`${this.path}`, this.cart.createCart);
    this.router.put(`${this.path}/quantity`, this.cart.changeQuantity);
    this.router.patch('/api/cart-product/:cartProductId', this.cart.deleteCartProduct);
  }
}
