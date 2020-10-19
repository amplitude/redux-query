import idx from 'idx';

import { State as ErrorsState } from '../reducers/errors';
import { getQueryKey } from '../lib/query-key';
import { QueryConfig } from '../types';

export const responseBody = (
  errorsState: ErrorsState,
  queryConfig: QueryConfig,
):
  | {
      [key: string]: any,
    }
  | null
  | undefined => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return null;
  }

  return idx(errorsState, _ => _[queryKey].responseBody);
};

export const responseText = (
  errorsState: ErrorsState,
  queryConfig: QueryConfig,
): string | null | undefined => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return null;
  }

  return idx(errorsState, _ => _[queryKey].responseText);
};

export const responseHeaders = (
  errorsState: ErrorsState,
  queryConfig: QueryConfig,
):
  | {
      [key: string]: any,
    }
  | null
  | undefined => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return null;
  }

  return idx(errorsState, _ => _[queryKey].responseHeaders);
};
