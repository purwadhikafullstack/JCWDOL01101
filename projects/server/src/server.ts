import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { UserRoute } from './routes/user.route';
import { ProductRoute } from './routes/product.route';
import { CartRoute } from './routes/cart.route';
import { CityRoute } from './routes/city.route';
import { ProvinceRoute } from './routes/province.route';
import { AddressRoute } from './routes/address.route';

ValidateEnv();

const app = new App([new UserRoute(), new ProductRoute(), new CartRoute(), new CityRoute(), new ProvinceRoute(), new AddressRoute()]);

app.listen();
