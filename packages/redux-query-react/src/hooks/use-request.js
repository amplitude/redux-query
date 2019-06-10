// @flow

import * as React from 'react';
import { useDispatch } from 'react-redux';
import { requestAsync, cancelQuery, getQueryKey } from 'redux-query';
import type { QueryConfig } from 'redux-query/src/types';

import useConstCallback from './use-const-callback';
import useMemoizedQueryConfig from './use-memoized-query-config';
import useQueryState from './use-query-state';
import type { QueryState } from '../types';

const useRequest = (providedQueryConfig: ?QueryConfig): [QueryState, () => void] => {
  const reduxDispatch = useDispatch();

  const isPendingRef = React.useRef(false);

  const finishedCallback = useConstCallback(() => {
    isPendingRef.current = false;
  });

  const transformQueryConfig = useConstCallback(
    (queryConfig: QueryConfig): QueryConfig => {
      return {
        ...queryConfig,
        unstable_preDispatchCallback: finishedCallback,
        retry: true,
      };
    },
  );

  const queryConfig = useMemoizedQueryConfig(providedQueryConfig, transformQueryConfig);

  const queryState = useQueryState(queryConfig);

  const dispatchRequestToRedux = useConstCallback(action => {
    const promise = reduxDispatch(requestAsync(action));

    if (promise) {
      isPendingRef.current = true;
    }
  });

  const dispatchCancelToRedux = useConstCallback(action => {
    reduxDispatch(cancelQuery(action));
    isPendingRef.current = false;
  });

  const forceRequest = React.useCallback(() => {
    if (queryConfig) {
      dispatchRequestToRedux({
        ...queryConfig,
        force: true,
      });
    }
  }, [dispatchRequestToRedux, queryConfig]);

  React.useEffect(() => {
    if (queryConfig) {
      dispatchRequestToRedux(queryConfig);
    }

    return () => {
      if (isPendingRef.current) {
        dispatchCancelToRedux(getQueryKey(queryConfig));
      }
    };
  }, [dispatchCancelToRedux, dispatchRequestToRedux, queryConfig]);

  return [queryState, forceRequest];
};

export default useRequest;
