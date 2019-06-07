import * as React from 'react';
import { useDispatch } from 'react-redux';
import { requestAsync, cancelQuery, getQueryKey } from 'redux-query';

import useConstCallback from './use-const-callback';
import useMemoizedAction from './use-memoized-action';

const useRequest = providedQueryConfig => {
  const reduxDispatch = useDispatch();

  const isPendingRef = React.useRef(false);

  const [isPending, setIsPending] = React.useState(false);

  const finishedCallback = useConstCallback(() => {
    setIsPending(false);
    isPendingRef.current = false;
  });

  const transformQueryConfigToAction = useConstCallback(queryConfig => {
    return {
      ...queryConfig,
      unstable_preDispatchCallback: finishedCallback,
      retry: true,
    };
  });

  const requestReduxAction = useMemoizedAction(providedQueryConfig, transformQueryConfigToAction);

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
    if (requestReduxAction) {
      dispatchRequestToRedux({
        ...requestReduxAction,
        force: true,
      });
    }
  }, [dispatchRequestToRedux, requestReduxAction]);

  React.useEffect(() => {
    if (requestReduxAction) {
      dispatchRequestToRedux(requestReduxAction);
    }

    return () => {
      if (isPendingRef.current) {
        dispatchCancelToRedux(getQueryKey(requestReduxAction));
      }
    };
  }, [dispatchCancelToRedux, dispatchRequestToRedux, requestReduxAction]);

  return [isPending, forceRequest];
};

export default useRequest;
