import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { UserRoute } from './routes/user.route';
import { WarehouseRoute } from './routes/warehouse.route';
import { ProductRoute } from './routes/product.route';
import { CategoryRoute } from './routes/category.route';
import { CityRoute } from './routes/city.route';
import { ProvinceRoute } from './routes/province.route';
import { WarehouseAddressRoute } from './routes/warehouseAddress.router';
import { CartRoute } from './routes/cart.route';
import { AddressRoute } from './routes/address.route';
import { CheckoutRoute } from './routes/checkout.route';
import { DokuRoute } from './routes/doku.route';
import { ReviewRoute } from './routes/review.route';

ValidateEnv();

const app = new App([
  new UserRoute(),
  new ProductRoute(),
  new WarehouseRoute(),
  new CategoryRoute(),
  new CityRoute(),
  new ProvinceRoute(),
  new WarehouseAddressRoute(),
  new CartRoute(),
  new AddressRoute(),
  new CheckoutRoute(),
  new DokuRoute(),
  new AddressRoute(),
  new CheckoutRoute(),
  new ReviewRoute(),
]);

app.listen();
