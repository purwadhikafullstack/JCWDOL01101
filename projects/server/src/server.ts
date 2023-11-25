import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { UserRoute } from './routes/user.route';
import { WarehouseRoute } from './routes/warehouse.routes';
import { ProductRoute } from './routes/product.route';
import { CategoryRoute } from './routes/category.route';
import { CityRoute } from './routes/city.route';
import { ProvinceRoute } from './routes/province.route';
import { WarehouseAddressRoute } from './routes/warehouseAddress.router';
import { CartRoute } from './routes/cart.route';

ValidateEnv();

const app = new App([new UserRoute(), new ProductRoute(),new WarehouseRoute(),new CategoryRoute(),new CityRoute(), new ProvinceRoute(), new WarehouseAddressRoute(), new CartRoute()]);

app.listen();
