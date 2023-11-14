import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { HelloRoute } from './routes/hello.routes';

ValidateEnv();

const app = new App([new HelloRoute()]);

app.listen();
