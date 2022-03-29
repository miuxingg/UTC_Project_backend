import { QUERY_OPTION_DEFAULT } from '../configs';
import { BaseQuery, PaginationOption } from './BaseDTO';

export function aggregatePagination(options: PaginationOption = {}): any[] {
  const {
    limit = QUERY_OPTION_DEFAULT.LIMIT,
    offset = QUERY_OPTION_DEFAULT.OFFSET,
  } = options;

  return [
    {
      $facet: {
        items: [{ $skip: +offset }, { $limit: +limit }],
        total: [{ $count: 'total' }],
      },
    },
    { $set: { items: '$items', total: '$total.total' } },
    { $unwind: '$total' },
  ];
}

export function aggregateQuery(options: BaseQuery = {}): any[] {
  const {
    limit = QUERY_OPTION_DEFAULT.LIMIT,
    offset = QUERY_OPTION_DEFAULT.OFFSET,
  } = options;

  return [
    {
      $facet: {
        items: [{ $skip: +offset }, { $limit: +limit }],
        total: [{ $count: 'total' }],
      },
    },
    { $set: { items: '$items', total: '$total.total' } },
    { $unwind: '$total' },
  ];
}
