import { Cart } from '@/interfaces/cart.interface';
import { CartProduct } from '@/interfaces/cartProduct.interface';
import { CartService } from '@/services/cart.service';
import { WithAuthProp } from '@clerk/clerk-sdk-node';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class CartContoller {
  cart = Container.get(CartService);

  public getCarts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);
      const findCarts = await this.cart.getCart(userId);
      res.status(200).json({
        data: findCarts,
        message: 'get.carts',
      });
    } catch (err) {
      next(err);
    }
  };

  public getCartProduct = async (req: WithAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.productId);
      const findCartProduct: CartProduct[] = await this.cart.getCartProduct(productId, req.auth.userId);
      res.status(200).json({
        data: findCartProduct,
        message: 'get.cartProduct',
      });
    } catch (err) {
      next(err);
    }
  };

  public getCartProductOnSize = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.productId);
      const sizeId = Number(req.params.sizeId);
      const { cartProduct, stock } = await this.cart.getCartProductOnSize(productId, sizeId);
      res.status(200).json({
        data: { cartProduct, stock },
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
      const sizeId = Number(req.body.sizeId);
      const quantity = Number(req.body.qty);

      const cartProduct = await this.cart.changeQuantity({ sizeId, productId, cartId, quantity });
      res.status(200).json({
        data: cartProduct,
        message: 'post.increment',
      });
    } catch (err) {
      next(err);
    }
  };

  public deleteAllCartProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cartId = Number(req.params.cartId);
      const deletedCartProduct: CartProduct[] = await this.cart.deleteAllCartProduct(cartId);

      res.status(200).json({
        data: deletedCartProduct,
        message: 'delete.cartProducts',
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

  public cancelDeleteCartProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cartProductId = Number(req.params.cartProductId);
      const cancelDeletedCartProduct: CartProduct = await this.cart.cancelDeleteCartProduct(cartProductId);

      res.status(200).json({
        data: cancelDeletedCartProduct,
        message: 'delete.cancel',
      });
    } catch (err) {
      next(err);
    }
  };

  public toggleSelectedCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cartProductId = Number(req.params.cartProductId);
      const value = Boolean(req.body.value);
      const toggleSelectedCart: CartProduct = await this.cart.toggleSelectedProduct(cartProductId, value);

      res.status(200).json({
        data: toggleSelectedCart,
        message: 'toggle selected cart',
      });
    } catch (err) {
      next(err);
    }
  };

  public toggleAllSelectedCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cartId = Number(req.params.cartId);
      const toggleSelectedCart: CartProduct[] = await this.cart.toggleAllSelectedProduct(cartId);

      res.status(200).json({
        data: toggleSelectedCart,
        message: 'toggle all selected cart',
      });
    } catch (err) {
      next(err);
    }
  };

  public createCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.body.productId);
      const quantity = Number(req.body.quantity);
      const sizeId = Number(req.body.sizeId);
      const externalId = req.body.externalId as string;
      const cart: Cart = await this.cart.createCart({ externalId, productId, quantity, sizeId });

      res.status(201).json({
        data: cart,
        messasge: 'cart.created',
      });
    } catch (err) {
      next(err);
    }
  };
}
