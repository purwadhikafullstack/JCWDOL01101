import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
// import { HelloRoute } from './routes/hello.routes';
import { WarehouseRoute } from './routes/warehouses.routes';

ValidateEnv();

const app = new App([new WarehouseRoute()]);

app.listen();
