import { get } from '../lib/object';

import { getQueryKey } from '../lib/query-key';

export const isFinished = (queriesState, queryConfig) => {
  if (queryConfig) {
    const queryKey = getQueryKey(queryConfig);

    return get(queriesState, [queryKey, 'isFinished']);
  }
};

export const isPending = (queriesState, queryConfig) => {
  if (queryConfig) {
    const queryKey = getQueryKey(queryConfig);

    return get(queriesState, [queryKey, 'isPending']);
  }
};

export const status = (queriesState, queryConfig) => {
  if (queryConfig) {
    const queryKey = getQueryKey(queryConfig);

    return get(queriesState, [queryKey, 'status']);
  }
};

export const headers = (queriesState, queryConfig) => {
  if (queryConfig) {
    const queryKey = getQueryKey(queryConfig);

    return get(queriesState, [queryKey, 'headers']);
  }
};

export const lastUpdated = (queriesState, queryConfig) => {
  if (queryConfig) {
    const queryKey = getQueryKey(queryConfig);

    return get(queriesState, [queryKey, 'lastUpdated']);
  }
};

export const queryCount = (queriesState, queryConfig) => {
  if (queryConfig) {
    const queryKey = getQueryKey(queryConfig);

    return get(queriesState, [queryKey, 'queryCount']);
  }
};
