import { DB } from '@/database';
import { CartDto, CartProductDto } from '@/dtos/cart.dto';
import { HttpException } from '@/exceptions/HttpException';
import { Cart } from '@/interfaces/cart.interface';
import { CartProduct } from '@/interfaces/cartProduct.interface';
import { User } from '@/interfaces/user.interface';
import { CartProductModel } from '@/models/cartProduct.model';
import { ImageModel } from '@/models/image.model';
import { InventoryModel } from '@/models/inventory.model';
import { ProductModel } from '@/models/product.model';
import { Service } from 'typedi';

@Service()
export class CartService {
  public async getCart(userId: number): Promise<{ cart: Cart; totalQuantity: number; totalPrice: number }> {
    const findCart: Cart = await DB.Cart.findOne({
      where: { status: 'ACTIVE', userId },
      attributes: ['id'],
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
              include: [
                {
                  model: ImageModel,
                  as: 'productImage',
                },
              ],
              where: {
                status: 'ACTIVE',
              },
              required: false,
            },
          ],
        },
      ],
    });

    if (!findCart) throw new HttpException(409, "Cart doesn't exist");
    const totalQuantity = await CartProductModel.sum('quantity', {
      where: {
        cartId: findCart.id,
        status: 'ACTIVE',
      },
    });

    const totalPrice: { total: number }[] = await DB.sequelize.query(
      `SELECT SUM(price * quantity) as total 
  FROM cart_product 
  WHERE cart_id = :cartId AND status = 'ACTIVE'`,
      {
        replacements: { cartId: findCart.id },
        type: DB.Sequelize.QueryTypes.SELECT,
      },
    );

    return { cart: findCart, totalQuantity, totalPrice: totalPrice[0].total || 0 };
  }

  public async getCartProduct(productId: number): Promise<CartProduct> {
    const findCartProduct = await DB.CartProduct.findOne({
      where: { status: 'ACTIVE', productId },
      include: {
        model: ProductModel,
        as: 'product',
        include: [
          {
            model: ImageModel,
            as: 'productImage',
          },
          {
            model: InventoryModel,
            as: 'inventory',
            attributes: ['stock', 'sold'],
          },
        ],
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
            selected: true,
            status: 'ACTIVE',
          },
          { where: { id: findCartProduct.id } },
        );
      } else {
        await DB.CartProduct.create({
          quantity,
          productId,
          selected: true,
          cartId: findCart.id,
          price: findProduct.price,
        });
      }
    }

    return findCart;
  }
  public async deleteAllCartProduct(cartId: number) {
    const findCartProducts = await DB.CartProduct.findAll({ where: { cartId, status: 'ACTIVE' } });
    if (!findCartProducts || findCartProducts.length === 0) throw new HttpException(409, `Items doesn't exist`);

    const idsToUpdate = findCartProducts.filter(cp => cp.selected).map(cp => cp.productId);

    await DB.CartProduct.update({ status: 'DELETED' }, { where: { cartId, productId: idsToUpdate } });
    return findCartProducts;
  }

  public async deleteCartProduct(cartProductId: number) {
    const findCartProduct = await DB.CartProduct.findByPk(cartProductId);
    if (!findCartProduct) throw new HttpException(409, `Item doesn't exist`);

    await DB.CartProduct.update({ status: 'DELETED' }, { where: { id: cartProductId } });
    return findCartProduct;
  }

  public async toggleSelectedProduct(cartProductId: number, value: boolean) {
    const findCartProduct = await DB.CartProduct.findByPk(cartProductId);
    if (!findCartProduct) throw new HttpException(409, `Item doesn't exist`);

    await DB.CartProduct.update({ selected: value }, { where: { id: cartProductId } });
    return findCartProduct;
  }

  public async toggleAllSelectedProduct(cartId: number): Promise<CartProduct[]> {
    const findCartProducts = await DB.CartProduct.findAll({ where: { cartId, status: 'ACTIVE' } });
    if (!findCartProducts || findCartProducts.length === 0) throw new HttpException(409, `Item doesn't exist`);

    const allSelected = findCartProducts.every(cartProduct => cartProduct.selected);
    const idsToUpdate = findCartProducts.map(cp => cp.id);
    await DB.CartProduct.update({ selected: !allSelected }, { where: { id: idsToUpdate } });
    return findCartProducts;
  }

  public async cancelDeleteCartProduct(cartProductId: number) {
    const findCartProduct = await DB.CartProduct.findByPk(cartProductId);
    if (!findCartProduct) throw new HttpException(409, `Item doesn't exist`);

    await DB.CartProduct.update({ status: 'ACTIVE' }, { where: { id: cartProductId } });
    return findCartProduct;
  }

  public async deleteCartByUserId(cartId: number): Promise<Cart> {
    const findUserCart = await DB.Cart.findByPk(cartId);
    if (!findUserCart) throw new HttpException(409, "Cart doesn't exist");
    await DB.Cart.update({ status: 'DELETED' }, { where: { id: cartId } });

    return findUserCart;
  }
}
