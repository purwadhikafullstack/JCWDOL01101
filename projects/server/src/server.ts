import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { UserRoute } from './routes/user.routes';
import { WarehouseRoute } from './routes/warehouse.routes';
import { ProductRoute } from './routes/product.route';

ValidateEnv();

const app = new App([new UserRoute(), new ProductRoute(),new WarehouseRoute()]);

app.listen();
