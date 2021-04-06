import * as React from 'react';
import { getQueryKey, QueryConfig, QueryKey } from 'redux-query';

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T; // from lodash
const truthy = <T>(value: T): value is Truthy<T> => {
  return !!value;
};

const identity = (x) => x;

/**
 * This hook memoizes the list of query configs that are returned form the `mapPropsToConfigs`
 * function. It also transforms the query configs to set `retry` to `true` and pass a
 * synchronous callback to track pending state.
 *
 * `mapPropsToConfigs` may return null, undefined, a single query config,
 * or a list of query configs. null and undefined values are ignored, and single query configs are
 * normalized to be lists.
 *
 * Memoization is handled by comparing query keys. If the list changes in size, or any query config
 * in the list's query key changes, an entirely new list of query configs is returned.
 */
const useMemoizedQueryConfigs = (
  providedQueryConfigs: Array<QueryConfig> | undefined,
  transform: (arg0: QueryConfig) => QueryConfig = identity,
): Array<QueryConfig> => {
  const queryConfigs = providedQueryConfigs
    ? providedQueryConfigs
        .map((queryConfig: QueryConfig): QueryConfig | null => {
          const queryKey = getQueryKey(queryConfig);

          if (!queryKey) {
            return null;
          }

          return transform(queryConfig);
        })
        .filter(truthy)
    : [];
  const [memoizedQueryConfigs, setMemoizedQueryConfigs] = React.useState<Array<QueryConfig>>(
    queryConfigs,
  );
  const previousQueryKeys = React.useRef<Array<QueryKey>>(
    queryConfigs.map(getQueryKey).filter(truthy),
  );

  React.useEffect(() => {
    const queryKeys = queryConfigs.map(getQueryKey).filter(truthy);

    if (
      queryKeys.length !== previousQueryKeys.current.length ||
      queryKeys.some((queryKey, i) => previousQueryKeys.current[i] !== queryKey)
    ) {
      previousQueryKeys.current = queryKeys;
      setMemoizedQueryConfigs(queryConfigs);
    }
  }, [queryConfigs]);

  return memoizedQueryConfigs;
};

export default useMemoizedQueryConfigs;
