import * as React from 'react';
import { getQueryKey } from 'redux-query';

/**
 * Other hooks are guaranteed to only receive a new Redux action if and only if the query key of
 * the provided queryConfig changes.
 */
const useMemoizedAction = (queryConfig, callback) => {
  const [memoizedQueryConfig, setMemoizedQueryConfig] = React.useState({
    ...queryConfig,
    unstable_preDispatchCallback: callback,
  });
  const previousQueryKey = React.useRef(getQueryKey(queryConfig));

  React.useEffect(() => {
    const queryKey = getQueryKey(queryConfig);

    if (queryKey !== previousQueryKey.current) {
      previousQueryKey.current = queryKey;
      setMemoizedQueryConfig({
        ...queryConfig,
        unstable_preDispatchCallback: callback,
      });
    }
  }, [callback, queryConfig]);

  return memoizedQueryConfig;
};

export default useMemoizedAction;
