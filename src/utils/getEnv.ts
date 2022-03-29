import { Logger } from '@nestjs/common';

export function getEnv<T>(key: string, defaultValue: T): T {
  if (!process.env[key]) {
    Logger.error(
      `Missing environment key: ${key}. Using default value: ${defaultValue}`,
    );
    return defaultValue;
  }

  return process.env[key] as unknown as T;
}
