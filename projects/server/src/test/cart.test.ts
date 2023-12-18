import { App } from '@/app';
import { CartDto, CartProductDto } from '@/dtos/cart.dto';
import { CartRoute } from '@/routes/cart.route';
import { Sequelize } from 'sequelize';
import request from 'supertest';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Cart', () => {
  describe('[GET] /cart/:userId', () => {
    it('should return the active cart for a user', async () => {
      const cartRoute = new CartRoute();
      const cart = cartRoute.cart.cart;
      const userId = 1;
      const expectResult = null;
      cart.getCart = jest.fn().mockReturnValue(expectResult);

      (Sequelize as any).authenticate = jest.fn();
      const app = new App([cartRoute]);
      return request(app.getServer()).get(`${cartRoute.path}/${userId}`).expect(200);
    });
  });
  describe('[POST] /cart', () => {
    it('should create a cart', async () => {
      const cartRoute = new CartRoute();
      const cart = cartRoute.cart.cart;

      const cartData: CartDto = {
        externalId: 'user_2Zd4Ny0ZTXF0s4hhfzbvsEzeZAU',
        productId: 1,
        quantity: 3,
        sizeId: 1,
      };

      cart.createCart = jest.fn().mockReturnValue(cartData);

      (Sequelize as any).authenticate = jest.fn();
      const app = new App([cartRoute]);
      return request(app.getServer()).post(`${cartRoute.path}`).send(cartData).expect(201);
    });
  });
  describe('[PUT] /cart/quantity', () => {
    it('should change the quantity of a product in the cart', async () => {
      const cartRoute = new CartRoute();
      const cart = cartRoute.cart.cart;

      const cartProductData: CartProductDto = {
        cartId: 1,
        productId: 1,
        quantity: 3,
        sizeId: 1,
      };

      cart.changeQuantity = jest.fn().mockReturnValue(cartProductData);
      (Sequelize as any).authenticate = jest.fn();
      const app = new App([cartRoute]);
      return request(app.getServer()).put(`${cartRoute.path}/quantity`).send(cartProductData).expect(200);
    });
  });
  describe('[PATCH] /cart/proudcts/:cartId', () => {
    it('should change the status of all cart product to DELETED', async () => {
      const cartRoute = new CartRoute();
      const cart = cartRoute.cart.cart;
      const cartId = 1;

      cart.deleteAllCartProduct = jest.fn().mockReturnValue(cartId);
      (Sequelize as any).authenticate = jest.fn();
      const app = new App([cartRoute]);
      return request(app.getServer()).patch(`${cartRoute.path}/products/${cartId}`).expect(200);
    });
  });
  describe('[PATCH] /cart/proudcts/:cartProductId', () => {
    it('should change the status of cart product to DELETED', async () => {
      const cartRoute = new CartRoute();
      const cart = cartRoute.cart.cart;
      const cartProductId = 1;

      cart.deleteCartProduct = jest.fn().mockReturnValue(cartProductId);
      (Sequelize as any).authenticate = jest.fn();
      const app = new App([cartRoute]);
      return request(app.getServer()).patch(`${cartRoute.path}/products/${cartProductId}`).expect(200);
    });
  });
});
