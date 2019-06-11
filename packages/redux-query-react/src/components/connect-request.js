// @flow

import hoistStatics from 'hoist-non-react-statics';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { requestAsync, cancelQuery } from 'redux-query/src/actions';
import { getQueryKey } from 'redux-query/src/lib/query-key';

import type { QueryConfig, QueryKey } from 'redux-query/src/types';

import useConstCallback from '../hooks/use-const-callback';

type MapPropsToConfigs = (props: mixed) => QueryConfig | Array<QueryConfig>;

type Options = {|
  forwardRef?: boolean,
  pure?: boolean,
|};

const normalizeToArray = (maybe: QueryConfig | Array<QueryConfig>): Array<QueryConfig> => {
  return (Array.isArray(maybe) ? maybe : [maybe]).filter(Boolean);
};

const difference = <T>(a: Array<T>, b: Array<T>): Array<T> => {
  const bSet = new Set(b);

  return a.filter(x => !bSet.has(x));
};

const getDiff = (prevQueryConfigs: Array<QueryConfig>, queryConfigs: Array<QueryConfig>) => {
  const prevQueryKeys = prevQueryConfigs.map(config => getQueryKey(config));
  const queryKeys = queryConfigs.map(config => getQueryKey(config));
  const queryConfigByQueryKey = queryKeys.reduce((accum, queryKey: ?QueryKey, i) => {
    const queryConfig = queryConfigs[i];

    if (queryConfig) {
      accum.set(queryKey, queryConfig);
    }

    return accum;
  }, new Map());

  const cancelKeys = difference(prevQueryKeys, queryKeys).filter(Boolean);
  const requestKeys = difference(queryKeys, prevQueryKeys).filter(Boolean);
  const requestQueryConfigs = requestKeys
    .map(queryKey => queryConfigByQueryKey.get(queryKey))
    .filter(Boolean);

  return { cancelKeys, requestQueryConfigs };
};

const useMemoizedQueryConfigs = (
  mapPropsToConfigs,
  props,
  callback: (queryKey: QueryKey) => void,
) => {
  const queryConfigs = normalizeToArray(mapPropsToConfigs(props))
    .map(
      (queryConfig: QueryConfig): ?QueryConfig => {
        const queryKey = getQueryKey(queryConfig);

        if (queryKey) {
          return {
            ...queryConfig,
            unstable_preDispatchCallback: () => {
              callback(queryKey);
            },
          };
        }
      },
    )
    .filter(Boolean);
  const [memoizedQueryConfigs, setMemoizedQueryConfigs] = React.useState(queryConfigs);
  const previousQueryKeys = React.useRef(queryConfigs.map(getQueryKey));

  React.useEffect(() => {
    const queryKeys = queryConfigs.map(getQueryKey);

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

const useMultiRequest = (mapPropsToConfigs, props) => {
  const reduxDispatch = useDispatch();

  const previousQueryConfigs = React.useRef([]);

  const pendingRequests = React.useRef<Set<QueryKey>>(new Set());

  const dispatchRequestToRedux = useConstCallback((queryConfig: QueryConfig) => {
    const promise = reduxDispatch(requestAsync(queryConfig));

    if (promise) {
      const queryKey = getQueryKey(queryConfig);

      if (queryKey) {
        pendingRequests.current.add(queryKey);
      }
    }
  });

  const dispatchCancelToRedux = useConstCallback((queryKey: QueryKey) => {
    reduxDispatch(cancelQuery(queryKey));
    pendingRequests.current.delete(queryKey);
  });

  const queryConfigs = useMemoizedQueryConfigs(mapPropsToConfigs, props, (queryKey: QueryKey) => {
    pendingRequests.current.delete(queryKey);
  });

  React.useEffect(() => {
    const { cancelKeys, requestQueryConfigs } = getDiff(previousQueryConfigs.current, queryConfigs);

    requestQueryConfigs.forEach(dispatchRequestToRedux);
    cancelKeys.forEach(queryKey => dispatchCancelToRedux(queryKey));

    previousQueryConfigs.current = queryConfigs;

    return () => {
      [...pendingRequests.current].forEach(dispatchCancelToRedux);
    };
  }, [dispatchCancelToRedux, dispatchRequestToRedux, queryConfigs]);

  const forceRequest = React.useCallback(() => {
    queryConfigs.forEach(requestReduxAction => {
      dispatchRequestToRedux({
        ...requestReduxAction,
        force: true,
      });
    });
  }, [dispatchRequestToRedux, queryConfigs]);

  return forceRequest;
};

const connectRequest = <Config>(mapPropsToConfigs: MapPropsToConfigs, options: Options) => (
  WrappedComponent: React.AbstractComponent<Config>,
): React.AbstractComponent<Config> => {
  const { pure = true, forwardRef = false } = options || {};

  const ConnectRequestFunction = (props: Config) => {
    const forceRequest = useMultiRequest(mapPropsToConfigs, props);

    return <WrappedComponent {...props} forceRequest={forceRequest} />;
  };

  const ConnectRequest = pure ? React.memo(ConnectRequestFunction) : ConnectRequestFunction;
  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  const displayName = `ConnectRequest(${wrappedComponentName})`;

  ConnectRequest.displayName = displayName;

  if (forwardRef) {
    const forwarded = React.forwardRef<Config, mixed>((props: Config, ref) => (
      <ConnectRequest {...props} forwardedRef={ref} />
    ));

    forwarded.displayName = displayName;

    return hoistStatics(forwarded, WrappedComponent);
  }

  return hoistStatics(ConnectRequest, WrappedComponent);
};

export default connectRequest;
