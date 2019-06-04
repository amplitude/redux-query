import * as React from 'react';
import { useDispatch } from 'react-redux';
import { requestAsync, cancelQuery, getQueryKey } from 'redux-query';

const useMemoizedAction = (queryConfig, callback) => {
  const memoizedQueryConfig = React.useRef({
    ...queryConfig,
    unstable_preDispatchCallback: callback,
  });
  const previousQueryKey = React.useRef(getQueryKey(queryConfig));

  React.useEffect(() => {
    const queryKey = getQueryKey(queryConfig);

    if (queryKey !== previousQueryKey.current) {
      previousQueryKey.current = queryKey;
      memoizedQueryConfig.current = {
        ...queryConfig,
        unstable_preDispatchCallback: callback,
      };
    }
  }, [callback, queryConfig]);

  return memoizedQueryConfig.current;
};

const useRequest = providedQueryConfig => {
  const reduxDispatch = useDispatch();

  const isPendingRef = React.useRef(false);

  const [isPending, setIsPending] = React.useState(false);

  const finishedCallback = React.useCallback(() => {
    setIsPending(false);
    isPendingRef.current = false;
  }, []);

  const requestReduxAction = useMemoizedAction(providedQueryConfig, finishedCallback);

  const dispatchRequestToRedux = React.useCallback(
    action => {
      const promise = reduxDispatch(requestAsync(action));

      if (promise) {
        setIsPending(true);
        isPendingRef.current = true;
      }
    },
    [reduxDispatch],
  );

  const dispatchCancelToRedux = React.useCallback(
    action => {
      reduxDispatch(cancelQuery(action));
    },
    [reduxDispatch],
  );

  const forceRequest = React.useCallback(() => {
    dispatchRequestToRedux({
      ...requestReduxAction,
      force: true,
    });
  }, [dispatchRequestToRedux, requestReduxAction]);

  React.useEffect(() => {
    dispatchRequestToRedux(requestReduxAction);

    return () => {
      if (isPendingRef.current) {
        dispatchCancelToRedux(getQueryKey(requestReduxAction));
      }
    };
  }, [dispatchCancelToRedux, dispatchRequestToRedux, requestReduxAction]);

  return { isPending, forceRequest };
};

export default useRequest;
