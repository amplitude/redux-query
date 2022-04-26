// @flow

// NOTE(kelson): The public flow type interface for this hook is defined in use-request-on-demand.js.flow

import * as React from 'react';
import { useDispatch } from 'react-redux';
import { requestAsync } from 'redux-query';
import type { ActionPromiseValue, QueryConfig } from 'redux-query/types.js.flow';

import type { QueryState } from '../types';
import useQueryState from './use-query-state';

const useRequestOnDemand = (
  makeQueryConfig: (...args: $ReadOnlyArray<mixed>) => QueryConfig,
): [QueryState, (...args: $ReadOnlyArray<mixed>) => Promise<ActionPromiseValue>] => {
  const reduxDispatch = useDispatch();

  // This query config and query state are driven based off of the callback – so they represent
  // the query config that was used for the most-recent request callback.
  const [queryConfig, setQueryConfig] = React.useState(null);

  const queryState = useQueryState(queryConfig);

  const request = React.useCallback(
    (...args: $ReadOnlyArray<mixed>) => {
      const queryConfig = makeQueryConfig(...args);

      setQueryConfig(queryConfig);

      return reduxDispatch(requestAsync(queryConfig));
    },
    [makeQueryConfig, reduxDispatch],
  );

  return [queryState, request];
};

export default useRequestOnDemand;
