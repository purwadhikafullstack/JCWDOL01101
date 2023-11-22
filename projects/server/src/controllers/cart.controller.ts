import { Cart } from '@/interfaces/cart.interface';
import { CartProduct } from '@/interfaces/cartProduct.interface';
import { CartService } from '@/services/cart.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class CartContoller {
  cart = Container.get(CartService);

  public getCarts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);
      const findCarts: Cart = await this.cart.getCart(userId);
      res.status(200).json({
        data: findCarts,
        message: 'get.carts',
      });
    } catch (err) {
      next(err);
    }
  };

  public getCartProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.productId);
      const findCartProduct: CartProduct = await this.cart.getCartProduct(productId);
      res.status(200).json({
        data: findCartProduct,
        message: 'get.cartProduct',
      });
    } catch (err) {
      next(err);
    }
  };
  public changeQuantity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.body.productId);
      const cartId = Number(req.body.cartId);
      const quantity = Number(req.body.qty);

      const cartProduct = await this.cart.changeQuantity({ productId, cartId, quantity });
      res.status(200).json({
        data: cartProduct,
        message: 'post.increment',
      });
    } catch (err) {
      next(err);
    }
  };

  public deleteCartProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cartProductId = Number(req.params.cartProductId);

      const deletedCartProduct: CartProduct = await this.cart.deleteCartProduct(cartProductId);

      res.status(200).json({
        data: deletedCartProduct,
        message: 'delete.cartProduct',
      });
    } catch (err) {
      next(err);
    }
  };

  public createCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.body.productId);
      const quantity = Number(req.body.quantity);
      const externalId = req.body.externalId as string;
      const cart: Cart = await this.cart.createCart({ externalId, productId, quantity });

      res.status(200).json({
        data: cart,
        messasge: 'cart.created',
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
}
