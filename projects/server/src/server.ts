import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { UserRoute } from './routes/user.routes';
// import { HelloRoute } from './routes/hello.routes';
import { WarehouseRoute } from './routes/warehouses.routes';

ValidateEnv();

const app = new App([new UserRoute(),new WarehouseRoute()]);

app.listen();
