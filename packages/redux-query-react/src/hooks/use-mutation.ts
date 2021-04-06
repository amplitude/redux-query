// NOTE(ryan): The public flow type interface for this hook is defined in use-mutation.js.flow

import * as React from 'react';
import { useDispatch } from 'react-redux';
import { mutateAsync, ActionPromiseValue, QueryConfig } from 'redux-query';

import { QueryState } from '../types';
import useQueryState from './use-query-state';

const useMutation = (
  makeQueryConfig: (...args: ReadonlyArray<unknown>) => QueryConfig,
): [QueryState, (...args: ReadonlyArray<unknown>) => Promise<ActionPromiseValue>] => {
  const reduxDispatch = useDispatch();

  // This query config and query state are driven based off of the callback – so they represent
  // the the query config that was used for the most-recent mutation callback.
  const [queryConfig, setQueryConfig] = React.useState(null);

  const queryState = useQueryState(queryConfig);

  const mutate = React.useCallback(
    (...args) => {
      const queryConfig = makeQueryConfig(...args);

      setQueryConfig(queryConfig);

      return reduxDispatch(mutateAsync(queryConfig));
    },
    [makeQueryConfig, reduxDispatch],
  );

  return [queryState, mutate];
};

export default useMutation;
