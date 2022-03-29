import { QueryOptions } from 'mongoose';

import { QUERY_OPTION_DEFAULT } from '../configs';

export function buildQueryOption(options?: Record<string, any>): QueryOptions {
  const queryOptions: QueryOptions = {
    limit: options?.limit ?? QUERY_OPTION_DEFAULT.LIMIT,
    skip: options?.offset ?? QUERY_OPTION_DEFAULT.OFFSET,
  };

  return queryOptions;
}
