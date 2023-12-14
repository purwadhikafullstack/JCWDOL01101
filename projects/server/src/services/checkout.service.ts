import { RAJAONGKIR_API_KEY } from '@/config';
import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { CartProduct } from '@/interfaces/cartProduct.interface';
import { User } from '@/interfaces/user.interface';
import { Warehouse } from '@/interfaces/warehouse.interface';
import { CartModel } from '@/models/cart.model';
import { CategoryModel } from '@/models/category.model';
import { ImageModel } from '@/models/image.model';
import { InventoryModel } from '@/models/inventory.model';
import { ProductModel } from '@/models/product.model';
import { Location, findClosestWarehouse, findWarehousesAndDistributeStock } from '@/utils/closestWarehouse';
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

  public async getSelectedCartProduct(cartId: number) {
    const findAllCartProduct = await DB.CartProduct.findAll({
      where: { cartId, selected: true, status: 'ACTIVE' },
      include: [
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
    if (!findAllCartProduct || findAllCartProduct.length === 0) throw new HttpException(409, 'No Selected Item(s)');

    return findAllCartProduct;
  }

  public async findClosestWarehouseWithStock(externalId: string, targetLocation: Location): Promise<Warehouse | null> {
    const findUser: User = await DB.User.findOne({
      where: { externalId },
      include: [
        {
          model: CartModel,
          as: 'userCart',
          where: { status: 'ACTIVE' },
        },
      ],
    });

    if (!findUser) throw new HttpException(409, "user doesn't exist");

    const closestWarehouse: Warehouse = await findClosestWarehouse(targetLocation);
    const cartProducts: CartProduct[] = await DB.CartProduct.findAll({ where: { cartId: findUser.userCart.id, status: 'ACTIVE' } });

    const inventoryPromises = cartProducts.map(cp =>
      DB.Inventories.findOne({ where: { warehouseId: closestWarehouse.id, productId: cp.productId } }),
    );
    const inventories = await Promise.all(inventoryPromises);

    const canFulfill = cartProducts.every(cp => {
      const inventory = inventories.find(inv => inv.productId === cp.productId);
      return inventory && inventory.stock >= cp.quantity;
    });

    if (!canFulfill) {
      const updatedCurrentWarehouse = await findWarehousesAndDistributeStock(cartProducts, closestWarehouse);

      let canFulfillAfterUpdate = true;
      for (let i = 0; i < cartProducts.length; i++) {
        const cp = cartProducts[i];
        const inventory = updatedCurrentWarehouse.inventories.find(inv => inv.productId === cp.productId);
        if (!inventory || inventory.stock < cp.quantity) {
          await DB.CartProduct.update({ status: 'DELETED' }, { where: { id: cp.id } });
          canFulfillAfterUpdate = false;
          break;
        }
      }

      if (!canFulfillAfterUpdate) {
        throw new HttpException(409, `Not enough stock for all products`);
      }

      return updatedCurrentWarehouse;
    }

    return closestWarehouse;
  }
}
