import { DB } from '@/database';
import { CartDto, CartProductDto } from '@/dtos/cart.dto';
import { HttpException } from '@/exceptions/HttpException';
import { User, Cart, CartProduct } from '@/interfaces';
import { SizeModel, ProductModel, ImageModel, InventoryModel, CartProductModel } from '@/models';
import { Service } from 'typedi';

@Service()
export class CartService {
  public async getCart(userId: number): Promise<{ cart: Cart; totalQuantity: number; totalPrice: number; totalWeight: number }> {
    const transaction = await DB.sequelize.transaction();
    try {
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
                model: SizeModel,
                as: 'size',
              },
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
        transaction,
      });

      if (!findCart) throw new HttpException(404, "Cart doesn't exist");

      const totalQuantity = await CartProductModel.sum('quantity', {
        where: {
          cartId: findCart.id,
          status: 'ACTIVE',
        },
        transaction,
      });

      const cartProducts: CartProduct[] = await CartProductModel.findAll({
        where: {
          cartId: findCart.id,
          status: 'ACTIVE',
        },
        include: [
          {
            model: ProductModel,
            as: 'product',
            where: { status: 'ACTIVE' },
          },
        ],
        transaction,
      });

      const totalPrice = cartProducts.reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0);
      const totalWeight = cartProducts.reduce((total, cp) => {
        return total + cp.product.weight * cp.quantity;
      }, 0);

      await transaction.commit();

      return { cart: findCart, totalQuantity, totalPrice, totalWeight };
    } catch (err) {
      await transaction.rollback();
      throw new HttpException(500, 'Failed to get cart');
    }
  }

  public async getCartProduct(productId: number, externalId: string): Promise<CartProduct[]> {
    const transaction = await DB.sequelize.transaction();
    try {
      const findUser: User = await DB.User.findOne({ where: { externalId, status: 'ACTIVE' }, transaction });
      if (!findUser) throw new HttpException(409, "User doesn't exist");

      const findCurrentUserCart: Cart = await DB.Cart.findOne({ where: { userId: findUser.id, status: 'ACTIVE' }, transaction });
      const findCartProduct: CartProduct[] = await DB.CartProduct.findAll({
        where: { productId, cartId: findCurrentUserCart.id, status: 'ACTIVE' },
        include: [
          {
            model: SizeModel,
            as: 'size',
          },
          {
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
        ],
        transaction,
      });

      await transaction.commit();
      return findCartProduct || [];
    } catch (err) {
      await transaction.rollback();
      throw new HttpException(500, 'Failed to get cart product');
    }
  }

  public async getCartProductOnSize(productId: number, sizeId: number): Promise<{ cartProduct: CartProduct; stock: number }> {
    const findCartProduct: CartProduct = await DB.CartProduct.findOne({
      where: { status: 'ACTIVE', productId, sizeId },
      attributes: ['quantity', 'sizeId'],
      include: [
        {
          model: SizeModel,
          as: 'size',
        },
        {
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
      ],
    });

    const stock = await DB.Inventories.sum('stock', {
      where: {
        productId,
        sizeId,
      },
    });
    return { cartProduct: findCartProduct, stock };
  }

  public async changeQuantity(cartProductData: CartProductDto): Promise<CartProduct> {
    const { productId, cartId, quantity, sizeId } = cartProductData;
    const findCartProduct = await DB.CartProduct.findOne({ where: { productId, cartId } });
    if (!findCartProduct) throw new HttpException(409, `Couldn't find items with ID ${productId}`);
    await DB.CartProduct.update({ quantity }, { where: { productId, cartId, sizeId } });

    return findCartProduct;
  }

  public async createCart(cartData: CartDto) {
    const transaction = await DB.sequelize.transaction();
    try {
      const { externalId, productId, quantity = 1 } = cartData;
      const findUser: User = await DB.User.findOne({ where: { externalId, status: 'ACTIVE' }, transaction });
      if (!findUser) throw new HttpException(409, "User doesn't exist");

      const [findCart] = await DB.Cart.findOrCreate({
        where: { userId: findUser.id, status: 'ACTIVE' },
        defaults: { userId: findUser.id },
        transaction,
      });
      if (!findCart) throw new HttpException(500, 'Failed to create or find the cart');

      const findProduct = await DB.Product.findByPk(productId);
      if (!findProduct) throw new HttpException(409, "Product doesn't exist");

      const findSize = await DB.Size.findByPk(cartData.sizeId);
      if (!findSize) throw new HttpException(409, "Size doesn't exist");

      let findCartProduct = await DB.CartProduct.findOne({
        where: { productId, cartId: findCart.id, sizeId: findSize.id, status: 'ACTIVE' },
        transaction,
      });

      if (findCartProduct) {
        await findCartProduct.increment('quantity', { by: quantity });
        await findCartProduct.reload();
      } else {
        findCartProduct = await DB.CartProduct.findOne({
          where: { productId, cartId: findCart.id, sizeId: findSize.id, status: 'DELETED' },
          transaction,
        });
        if (findCartProduct) {
          await DB.CartProduct.update(
            {
              quantity,
              selected: true,
              status: 'ACTIVE',
            },
            { where: { id: findCartProduct.id }, transaction },
          );
        } else {
          await DB.CartProduct.create(
            {
              quantity,
              productId,
              selected: true,
              cartId: findCart.id,
              sizeId: findSize.id,
              price: findProduct.price,
            },
            { transaction },
          );
        }
      }

      await transaction.commit();
      return findCart;
    } catch (err) {
      await transaction.rollback();
      if (err instanceof HttpException) {
        if (err.status !== 500) {
          throw new HttpException(err.status, err.message);
        } else {
          throw new HttpException(500, 'Something went wrong');
        }
      }
    }
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
