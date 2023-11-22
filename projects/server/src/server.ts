import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { UserRoute } from './routes/user.routes';
import { ProductRoute } from './routes/product.route';
import { CartRoute } from './routes/cart.route';

ValidateEnv();

const app = new App([new UserRoute(), new ProductRoute(), new CartRoute()]);

app.listen();
