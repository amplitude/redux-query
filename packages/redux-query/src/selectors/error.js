// @flow

import idx from 'idx';

import type { State as ErrorsState } from '../reducers/errors';
import { getQueryKey } from '../lib/query-key';
import type { QueryConfig } from '../types';

export const responseBody = (
  errorsState: ErrorsState,
  queryConfig: QueryConfig,
): ?{ [key: string]: any } => {
  const queryKey = getQueryKey(queryConfig);

  return idx(errorsState, _ => _[queryKey].responseBody);
};

export const responseText = (errorsState: ErrorsState, queryConfig: QueryConfig): ?string => {
  const queryKey = getQueryKey(queryConfig);

  return idx(errorsState, _ => _[queryKey].responseText);
};

export const responseHeaders = (
  errorsState: ErrorsState,
  queryConfig: QueryConfig,
): ?{ [key: string]: any } => {
  const queryKey = getQueryKey(queryConfig);

  return idx(errorsState, _ => _[queryKey].responseHeaders);
};
