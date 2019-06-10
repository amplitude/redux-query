import * as React from 'react';
import { useDispatch } from 'react-redux';
import { requestAsync, cancelQuery, getQueryKey } from 'redux-query';

import useConstCallback from './use-const-callback';
import useMemoizedQueryConfig from './use-memoized-query-config';

const useRequest = providedQueryConfig => {
  const reduxDispatch = useDispatch();

  const isPendingRef = React.useRef(false);

  const [isPending, setIsPending] = React.useState(false);

  const finishedCallback = useConstCallback(() => {
    setIsPending(false);
    isPendingRef.current = false;
  });

  const transformQueryConfig = useConstCallback(queryConfig => {
    return {
      ...queryConfig,
      unstable_preDispatchCallback: finishedCallback,
      retry: true,
    };
  });

  const queryConfig = useMemoizedQueryConfig(providedQueryConfig, transformQueryConfig);

  const dispatchRequestToRedux = useConstCallback(action => {
    const promise = reduxDispatch(requestAsync(action));

    if (promise) {
      setIsPending(true);
      isPendingRef.current = true;
    }
  });

  const dispatchCancelToRedux = useConstCallback(action => {
    reduxDispatch(cancelQuery(action));
    setIsPending(false);
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

  return [isPending, forceRequest];
};

export default useRequest;
