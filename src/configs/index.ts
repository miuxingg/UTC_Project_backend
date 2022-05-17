import { getEnv } from 'src/utils/getEnv';

export const APP_PORT = getEnv('APP_PORT', 8000);

export const ADDRESS_URL = getEnv(
  'ADDRESS_URL',
  'https://provinces.open-api.vn/api',
);

export const QUERY_OPTION_DEFAULT = {
  LIMIT: 10,
  OFFSET: 0,
  SEARCH: '',
};

export const SALT_OR_ROUNDS = 10;

export const APP_SECRET = 'book.store.key.secret';

export const EXPRIRE_TOKEN = 3600000 * 24; //1h * 24h

export const DEFAULT_PASSWORD = 'bookstorelogin';
