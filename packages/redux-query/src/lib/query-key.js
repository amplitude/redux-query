// @flow

import stringify from 'fast-json-stable-stringify';

import type { QueryKeyGetter } from '../types';

export const getQueryKey: QueryKeyGetter = queryConfig => {
  if (!queryConfig) {
    return null;
  }

  const { url, body, queryKey } = queryConfig;

  if (queryKey !== null && queryKey !== undefined) {
    return queryKey;
  } else {
    return (stringify({ url, body }): string);
  }
};
