import { getEnv } from '../utils/getEnv';

export const MONGO_HOST = getEnv('MONGO_HOST', 'localhost');
export const MONGO_PORT = getEnv('MONGO_PORT', 27017);
export const MONGO_DATABASE = getEnv('MONGO_DATABASE', 'mongo-db');
export const MONGO_USERNAME = getEnv('MONGO_USERNAME', 'mongo-db');
export const MONGO_PASSWORD = getEnv('MONGO_PASSWORD', 'admin');

export const MONGO_CONNECTION =
  `mongodb+srv://bookstore:${MONGO_PASSWORD}@cluster0.lox7k.mongodb.net/BookStore?retryWrites=true&w=majority` as const;
