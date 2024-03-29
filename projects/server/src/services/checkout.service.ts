import { RAJAONGKIR_API_KEY } from '@/config';
import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { CartProduct, Inventory, Warehouse, User } from '@/interfaces';
import { CartModel, CategoryModel, ImageModel, InventoryModel, ProductModel, SizeModel } from '@/models';
import { Location, findClosestWarehouse } from '@/utils/closestWarehouse';
import axios from 'axios';
import { Service } from 'typedi';

type Courier = {
  code: string;
  name: string;
  costs: {
    service: string;
    description: string;
    cosnt: {
      value: number;
      edt: string;
      note: string;
    }[];
  }[];
};

@Service()
export class CheckoutService {
  public async getCourierService(origin: string, destination: string, weight: number, courier: string) {
    const res = await axios.post(
      'https://api.rajaongkir.com/starter/cost',
      { origin, destination, weight, courier },
      {
        headers: {
          key: RAJAONGKIR_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const results: Courier = res.data.rajaongkir.results[0];
    return results;
  }

  public async getSelectedCartProduct(
    cartId: number,
  ): Promise<{ cartProducts: CartProduct[]; weightTotal: number; totalQuantity: number; totalPrice: number }> {
    const where = { cartId, selected: true, status: 'ACTIVE' };
    const findAllCartProduct: CartProduct[] = await DB.CartProduct.findAll({
      where,
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
              model: CategoryModel,
              as: 'productCategory',
            },
            {
              model: InventoryModel,
              as: 'inventory',
              attributes: ['stock', 'sold'],
            },
          ],
        },
      ],
    });
    const weightTotal = findAllCartProduct.reduce((acc, cur) => acc + cur.product.weight * cur.quantity, 0);
    const totalQuantity = await DB.CartProduct.sum('quantity', { where });
    const totalPrice = findAllCartProduct.reduce((acc, cur) => acc + cur.product.price * cur.quantity, 0);

    return { cartProducts: findAllCartProduct, weightTotal, totalQuantity, totalPrice };
  }

  public async findClosestWarehouse(externalId: string, targetLocation: Location): Promise<Warehouse | null> {
    return DB.sequelize.transaction(async t => {
      const findUser: User = await DB.User.findOne({
        where: { externalId },
        include: [
          {
            model: CartModel,
            as: 'userCart',
            where: { status: 'ACTIVE' },
          },
        ],
        transaction: t,
      });

      if (!findUser) throw new HttpException(409, "user doesn't exist");
      const closestWarehouse: Warehouse = await findClosestWarehouse(targetLocation);
      const cartProducts: CartProduct[] = await DB.CartProduct.findAll({
        where: { cartId: findUser.userCart.id, status: 'ACTIVE' },
        transaction: t,
      });

      const productIds = cartProducts.map(cp => cp.productId);
      const productInventories: Inventory[] = await DB.Inventories.findAll({
        where: {
          productId: productIds,
        },
        attributes: ['productId', [DB.sequelize.fn('sum', DB.sequelize.col('stock')), 'totalStock']],
        group: ['productId'],
        raw: true,
        transaction: t,
      });

      let canFulfill = true;
      for (const inventory of productInventories) {
        if (inventory.totalStock <= 0) {
          canFulfill = false;
        }
      }

      if (!canFulfill) {
        throw new HttpException(409, 'Not enough stock for the products');
      }
      return closestWarehouse;
    });
  }
}
