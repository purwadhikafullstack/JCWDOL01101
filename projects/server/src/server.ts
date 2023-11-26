import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { UserRoute } from './routes/user.route';
import { ProductRoute } from './routes/product.route';
import { CartRoute } from './routes/cart.route';
import { AddressRoute } from './routes/address.route';
import { CheckoutRoute } from './routes/checkout.route';
import { DokuRoute } from './routes/doku.route';

ValidateEnv();

const app = new App([new UserRoute(), new ProductRoute(), new CartRoute(), new AddressRoute(), new CheckoutRoute(), new DokuRoute()]);

app.listen();
