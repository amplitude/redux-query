import * as React from 'react';
import { useDispatch } from 'react-redux';
import { requestAsync, cancelQuery, getQueryKey } from 'redux-query';

const useMemoizedQueryConfig = queryConfig => {
  const memoizedQueryConfig = React.useRef(queryConfig);
  const previousQueryKey = React.useRef(null);

  React.useEffect(() => {
    const queryKey = getQueryKey(queryConfig);

    if (!previousQueryKey.current || queryKey !== previousQueryKey.current) {
      previousQueryKey.current = queryKey;
      memoizedQueryConfig.current = queryConfig;
    }
  }, [queryConfig]);

  return memoizedQueryConfig.current;
};

const useRequest = providedQueryConfig => {
  const reduxDispatch = useDispatch();
  const [isPending, setIsPending] = React.useState(false);
  const queryConfig = useMemoizedQueryConfig(providedQueryConfig);

  const dispatchRequestToRedux = React.useCallback(
    queryConfig => {
      const promise = reduxDispatch(requestAsync(queryConfig));

      if (promise) {
        setIsPending(true);

        promise.then(() => {
          setIsPending(false);
        });
      }
    },
    [reduxDispatch],
  );

  const dispatchCancelToRedux = React.useCallback(
    queryConfig => {
      reduxDispatch(cancelQuery(queryConfig));
    },
    [reduxDispatch],
  );

  const forceRequest = React.useCallback(() => {
    dispatchRequestToRedux({
      ...queryConfig,
      force: true,
    });
  }, [dispatchRequestToRedux, queryConfig]);

  React.useEffect(() => {
    dispatchRequestToRedux(queryConfig);
  }, [dispatchRequestToRedux, queryConfig]);

  React.useEffect(() => {
    return () => {
      if (isPending) {
        dispatchCancelToRedux(queryConfig);
      }
    };
  }, [dispatchCancelToRedux, isPending, queryConfig]);

  return { isPending, forceRequest };
};

export default useRequest;
