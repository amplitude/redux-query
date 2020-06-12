// @flow

import idx from 'idx';

import type { State as QueriesState } from '../reducers/queries';
import { getQueryKey } from '../lib/query-key';
import type { QueryConfig, QueryDetails } from '../types';
import { createSelector } from 'reselect';

const defaultDetailsObject = {
  isFinished: false,
  isPending: false,
  headers: null,
  queryCount: 0,
};

export const getQueryDetails: (
  queriesState: QueriesState,
  queryConfig: ?QueryConfig,
) => QueryDetails = (queriesState: QueriesState, queryConfig: ?QueryConfig) => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return defaultDetailsObject;
  }

  return idx(queriesState, _ => _[queryKey]) || defaultDetailsObject;
};

export const isFinished: (
  queriesState: QueriesState,
  queryConfig: ?QueryConfig,
) => boolean = createSelector(
  getQueryDetails,
  query => query.isFinished,
);

export const isPending: (
  queriesState: QueriesState,
  queryConfig: ?QueryConfig,
) => boolean = createSelector(
  getQueryDetails,
  query => query.isPending,
);

export const status: (
  queriesState: QueriesState,
  queryConfig: ?QueryConfig,
) => ?number = createSelector(
  getQueryDetails,
  query => query.status,
);

export const headers: (
  queriesState: QueriesState,
  queryConfig: ?QueryConfig,
) => ?{ [key: string]: any } = createSelector(
  getQueryDetails,
  query => query.headers,
);

export const lastUpdated: (
  queriesState: QueriesState,
  queryConfig: ?QueryConfig,
) => ?number = createSelector(
  getQueryDetails,
  query => query.lastUpdated,
);

export const queryCount: (
  queriesState: QueriesState,
  queryConfig: ?QueryConfig,
) => number = createSelector(
  getQueryDetails,
  query => query.queryCount,
);
