import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV || 'development'}.local`) });
export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { OPENCAGE_API_KEY, RAJAONGKIR_API_KEY, CLERK_SECRET_KEY, DOKU_SECRET_KEY, DOKU_CLIENT_ID, DOKU_URL } = process.env;
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, WEBHOOK_SECRET, LOG_DIR, ORIGIN } = process.env;
export const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE } = process.env;
