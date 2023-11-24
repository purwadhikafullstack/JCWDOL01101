import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { UserRoute } from './routes/user.routes';
import { WarehouseRoute } from './routes/warehouse.routes';
import { ProductRoute } from './routes/product.route';
import { CategoryRoute } from './routes/category.route';
import { CityRoute } from './routes/city.route';
import { ProvinceRoute } from './routes/province.route';
import { AddressRoute } from './routes/address.router';

ValidateEnv();

const app = new App([new UserRoute(), new ProductRoute(),new WarehouseRoute(),new CategoryRoute(),new CityRoute(), new ProvinceRoute(), new AddressRoute()]);

app.listen();
