import { State as QueriesState } from '../reducers/queries';
import { getQueryKey } from '../lib/query-key';
import { QueryConfig, QueryDetails } from '../types';
import { createSelector } from 'reselect';

const defaultDetailsObject = {
  isFinished: false,
  isPending: false,
  headers: null,
  queryCount: 0,
};

export const getQueryDetails: (
  queriesState: QueriesState,
  queryConfig: QueryConfig | null | undefined,
) => QueryDetails = (queriesState: QueriesState, queryConfig: QueryConfig | null | undefined) => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return defaultDetailsObject;
  }

  return queriesState?.[queryKey] || defaultDetailsObject;
};

export const isFinished: (
  queriesState: QueriesState,
  queryConfig: QueryConfig | null | undefined,
) => boolean = createSelector(getQueryDetails, (query) => query.isFinished);

export const isPending: (
  queriesState: QueriesState,
  queryConfig: QueryConfig | null | undefined,
) => boolean = createSelector(getQueryDetails, (query) => query.isPending);

export const status: (
  queriesState: QueriesState,
  queryConfig: QueryConfig | null | undefined,
) => number | null | undefined = createSelector(getQueryDetails, (query) => query.status);

export const headers: (
  queriesState: QueriesState,
  queryConfig: QueryConfig | null | undefined,
) =>
  | {
      [key: string]: any;
    }
  | null
  | undefined = createSelector(getQueryDetails, (query) => query.headers);

export const lastUpdated: (
  queriesState: QueriesState,
  queryConfig: QueryConfig | null | undefined,
) => number | null | undefined = createSelector(getQueryDetails, (query) => query.lastUpdated);

export const queryCount: (
  queriesState: QueriesState,
  queryConfig: QueryConfig | null | undefined,
) => number = createSelector(getQueryDetails, (query) => query.queryCount);
