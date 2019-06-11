// @flow

import idx from 'idx';

import type { State as QueriesState } from '../reducers/queries';
import { getQueryKey } from '../lib/query-key';
import type { QueryConfig } from '../types';

export const isFinished = (queriesState: QueriesState, queryConfig: QueryConfig): boolean => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return false;
  }

  return idx(queriesState, _ => _[queryKey].isFinished) || false;
};

export const isPending = (queriesState: QueriesState, queryConfig: QueryConfig): boolean => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return false;
  }

  return idx(queriesState, _ => _[queryKey].isPending) || false;
};

export const status = (queriesState: QueriesState, queryConfig: QueryConfig): ?number => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return null;
  }

  return idx(queriesState, _ => _[queryKey].status);
};

export const headers = (
  queriesState: QueriesState,
  queryConfig: QueryConfig,
): ?{ [key: string]: any } => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return null;
  }

  return idx(queriesState, _ => _[queryKey].headers);
};

export const lastUpdated = (queriesState: QueriesState, queryConfig: QueryConfig): ?number => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return null;
  }

  return idx(queriesState, _ => _[queryKey].lastUpdated);
};

export const queryCount = (queriesState: QueriesState, queryConfig: QueryConfig): number => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return 0;
  }

  return idx(queriesState, _ => _[queryKey].queryCount) || 0;
};
