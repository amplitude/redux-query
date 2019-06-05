import * as React from 'react';
import { getQueryKey } from 'redux-query';

/**
 * Other hooks are guaranteed to only receive a new Redux action if and only if the query key of
 * the provided queryConfig changes.
 */
const useMemoizedAction = (queryConfig, transform) => {
  const [memoizedAction, setMemoizedAction] = React.useState(transform(queryConfig));
  const previousQueryKey = React.useRef(getQueryKey(queryConfig));

  React.useEffect(() => {
    const queryKey = getQueryKey(queryConfig);

    if (queryKey !== previousQueryKey.current) {
      previousQueryKey.current = queryKey;
      setMemoizedAction(transform);
    }
  }, [queryConfig, transform]);

  return memoizedAction;
};

export default useMemoizedAction;
