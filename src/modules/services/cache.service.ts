import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { TTL_RESET_PASSWORD } from 'src/configs/cache.config';
import { generateUniqueString } from 'src/utils/generateUniqueString';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async getValue(key: string): Promise<string | null> {
    const value = await this.cache.get<string | null>(key);
    await this.cache.del(key);
    return value;
  }

  async setCacheResetPasswordToken(
    value: string,
  ): Promise<{ key: string; ttl: number }> {
    const key = generateUniqueString();
    await this.cache.set(key, value, { ttl: TTL_RESET_PASSWORD });
    return { key, ttl: TTL_RESET_PASSWORD };
  }
  async setCacheVerifyEmail(
    value: string,
  ): Promise<{ key: string; ttl: number }> {
    const key = generateUniqueString();
    await this.cache.set(key, value, { ttl: TTL_RESET_PASSWORD });
    return { key, ttl: TTL_RESET_PASSWORD };
  }
}
