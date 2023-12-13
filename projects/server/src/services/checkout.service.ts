import { RAJAONGKIR_API_KEY } from '@/config';
import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { CategoryModel } from '@/models/category.model';
import { ImageModel } from '@/models/image.model';
import { InventoryModel } from '@/models/inventory.model';
import { ProductModel } from '@/models/product.model';
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
}
