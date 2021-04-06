import * as React from 'react';
import { getQueryKey, QueryConfig } from 'redux-query';

const identity = (x) => x;

/**
 * Other hooks are guaranteed to only receive a new Redux action if and only if the query key of
 * the provided queryConfig changes.
 */
const useMemoizedQueryConfig = (
  providedQueryConfig: QueryConfig | undefined,
  transform: (arg0: QueryConfig) => QueryConfig = identity,
): QueryConfig => {
  const [queryConfig, setQueryConfig] = React.useState(
    providedQueryConfig ? transform(providedQueryConfig) : null,
  );
  const previousQueryKey = React.useRef(getQueryKey(providedQueryConfig));

  React.useEffect(() => {
    const queryKey = getQueryKey(providedQueryConfig);

    if (queryKey !== previousQueryKey.current) {
      previousQueryKey.current = queryKey;
      setQueryConfig(providedQueryConfig ? transform(providedQueryConfig) : null);
    }
  }, [providedQueryConfig, transform]);

  return queryConfig;
};

export default useMemoizedQueryConfig;
