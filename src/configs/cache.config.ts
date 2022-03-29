// import { CacheModuleOptions } from '@nestjs/common';
// import * as redisStore from 'cache-manager-redis-store';

// import { getEnv } from '../utils/getEnv';

// export const cacheModuleOptions: CacheModuleOptions = {
//   store: redisStore,
//   host: '127.0.0.1',
//   port: 6379,
//   ttl: 300,
//   isGlobal: true,
// };

export const TTL_RESET_PASSWORD = 15 * 60; // 15 minutes <-> 15*60 second
