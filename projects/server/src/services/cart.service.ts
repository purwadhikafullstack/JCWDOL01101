import { DB } from '@/database';
import { CartDto, CartProductDto } from '@/dtos/cart.dto';
import { HttpException } from '@/exceptions/HttpException';
import { Cart } from '@/interfaces/cart.interface';
import { CartProduct } from '@/interfaces/cartProduct.interface';
import { User } from '@/interfaces/user.interface';
import { CartProductModel } from '@/models/cartProduct.model';
import { ProductModel } from '@/models/product.model';
import { Service } from 'typedi';

@Service()
export class CartService {
  public async getCart(userId: number): Promise<Cart> {
    const findCarts = await DB.Cart.findOne({
      where: { status: 'ACTIVE', userId },
      include: [
        {
          model: CartProductModel,
          as: 'cartProducts',
          where: {
            status: 'ACTIVE',
          },
          required: false,
          include: [
            {
              model: ProductModel,
              as: 'product',
            },
          ],
        },
      ],
    });

    return findCarts;
  }

  public async getCartProduct(productId: number): Promise<CartProduct> {
    const findCartProduct = await DB.CartProduct.findOne({
      where: { status: 'ACTIVE', productId },
      include: {
        model: ProductModel,
        as: 'product',
        where: {
          status: 'ACTIVE',
        },
      },
    });

    if (!findCartProduct) throw new HttpException(409, "Cart Product doesn't exists");

    return findCartProduct;
  }

  public async changeQuantity(cartProductData: CartProductDto): Promise<CartProduct> {
    const { productId, cartId, quantity } = cartProductData;
    const findCartProduct = await DB.CartProduct.findOne({ where: { productId, cartId } });
    if (!findCartProduct) throw new HttpException(409, `Couldn't find items with ID ${productId}`);

    if (quantity > 0) {
      await findCartProduct.increment('quantity', { by: quantity });
      await findCartProduct.reload();
    } else if (quantity < 0) {
      await findCartProduct.decrement('quantity');
      await findCartProduct.reload();
    }
    return findCartProduct;
  }

  public async createCart(cartData: CartDto) {
    const { externalId, productId, quantity = 1 } = cartData;
    const findUser: User = await DB.User.findOne({ where: { externalId, status: 'ACTIVE' } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const [findCart] = await DB.Cart.findOrCreate({
      where: { userId: findUser.id, status: 'ACTIVE' },
      defaults: { userId: findUser.id },
    });
    if (!findCart) throw new HttpException(500, 'Failed to create or find the cart');

    const findProduct = await DB.Product.findByPk(productId);
    if (!findProduct) throw new HttpException(409, "Product doesn't exist");

    let findCartProduct = await DB.CartProduct.findOne({ where: { productId, cartId: findCart.id, status: 'ACTIVE' } });
    if (findCartProduct) {
      await findCartProduct.increment('quantity', { by: quantity });
      await findCartProduct.reload();
    } else {
      findCartProduct = await DB.CartProduct.findOne({ where: { productId, cartId: findCart.id, status: 'DELETED' } });
      if (findCartProduct) {
        await DB.CartProduct.update(
          {
            quantity,
            status: 'ACTIVE',
          },
          { where: { id: findCartProduct.id } },
        );
      } else {
        await DB.CartProduct.create({
          quantity,
          productId,
          cartId: findCart.id,
          price: findProduct.price,
        });
      }
    }

    return findCart;
  }

  public async deleteCartProduct(cartProductId: number) {
    const findCartProduct = await DB.CartProduct.findByPk(cartProductId);
    if (!findCartProduct) throw new HttpException(409, `Item doesn't exist`);

    await DB.CartProduct.update({ status: 'DELETED' }, { where: { id: cartProductId } });

    return findCartProduct;
  }
}
