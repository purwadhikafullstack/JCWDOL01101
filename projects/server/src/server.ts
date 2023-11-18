import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { UserRoute } from './routes/user.routes';
import { WarehouseRoute } from './routes/warehouse.routes';

ValidateEnv();

const app = new App([new UserRoute(),new WarehouseRoute()]);

app.listen();
