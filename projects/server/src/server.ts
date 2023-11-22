import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { UserRoute } from './routes/user.route';
import { ProductRoute } from './routes/product.route';

ValidateEnv();

const app = new App([new UserRoute(), new ProductRoute()]);

app.listen();
