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
