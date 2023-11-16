import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { HelloRoute } from './routes/hello.routes';
import { UserRoute } from './routes/users.routes';

ValidateEnv();

const app = new App([new HelloRoute(), new UserRoute()]);

app.listen();
