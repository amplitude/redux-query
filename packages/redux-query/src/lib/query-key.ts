import stringify from 'json-stable-stringify';

import { QueryKeyGetter } from '../types';

export const getQueryKey: QueryKeyGetter = queryConfig => {
  if (!queryConfig) {
    return null;
  }

  const { url, body, queryKey } = queryConfig;

  if (queryKey !== null && queryKey !== undefined) {
    return queryKey;
  } else {
    return stringify({ url, body }) as string;
  }
};
