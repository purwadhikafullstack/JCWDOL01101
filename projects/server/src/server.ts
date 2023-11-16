import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { UserRoute } from './routes/user.routes';

ValidateEnv();

const app = new App([new UserRoute()]);

app.listen();
