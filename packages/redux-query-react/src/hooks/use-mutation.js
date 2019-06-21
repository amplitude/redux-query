// @flow

import * as React from 'react';
import { useDispatch } from 'react-redux';
import { mutateAsync } from 'redux-query';

import type { ActionPromiseValue, QueryConfig } from 'redux-query/types.js.flow';

import useConstCallback from './use-const-callback';
import useMemoizedQueryConfig from './use-memoized-query-config';
import useQueryState from './use-query-state';

import type { QueryState } from '../types';

const useMutation = (
  providedQueryConfig: ?QueryConfig,
): [QueryState, () => ?Promise<ActionPromiseValue>] => {
  const reduxDispatch = useDispatch();

  const isPendingRef = React.useRef(false);

  const finishedCallback = useConstCallback(() => {
    isPendingRef.current = false;
  });

  const transformQueryConfig = useConstCallback(queryConfig => {
    return {
      ...queryConfig,
      unstable_preDispatchCallback: finishedCallback,
    };
  });

  const queryConfig = useMemoizedQueryConfig(providedQueryConfig, transformQueryConfig);

  const queryState = useQueryState(queryConfig);

  const mutate = React.useCallback(() => {
    if (!queryConfig) {
      return null;
    }

    const promise = reduxDispatch(mutateAsync(queryConfig));

    if (promise) {
      isPendingRef.current = true;
    }

    return promise;
  }, [reduxDispatch, queryConfig]);

  return [queryState, mutate];
};

export default useMutation;
