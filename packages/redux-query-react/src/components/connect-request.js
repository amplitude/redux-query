// @flow

import hoistStatics from 'hoist-non-react-statics';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { requestAsync, cancelQuery, getQueryKey } from 'redux-query';

import type { QueryConfig, QueryKey } from 'redux-query/types.js.flow';

import useConstCallback from '../hooks/use-const-callback';
import useMemoizedQueryConfigs from '../hooks/use-memoized-query-configs';

type MapPropsToConfigs<T> = (props: T) => QueryConfig | Array<QueryConfig>;

type Options = {|
  forwardRef?: boolean,
  pure?: boolean,
|};

const normalizeToArray = (maybe: QueryConfig | Array<QueryConfig>): Array<QueryConfig> => {
  return (Array.isArray(maybe) ? maybe : [maybe]).filter(Boolean);
};

const difference = <T>(a: $ReadOnlyArray<T>, b: $ReadOnlyArray<T>): Array<T> => {
  const bSet = new Set(b);

  return a.filter(x => !bSet.has(x));
};

const diffQueryConfigs = (
  prevQueryConfigs: Array<QueryConfig>,
  queryConfigs: Array<QueryConfig>,
) => {
  const prevQueryKeys = prevQueryConfigs.map(config => getQueryKey(config));
  const queryKeys = queryConfigs.map(config => getQueryKey(config));
  const queryConfigByQueryKey = queryKeys.reduce((accum, queryKey: ?QueryKey, i) => {
    const queryConfig = queryConfigs[i];

    if (queryConfig) {
      accum.set(queryKey, queryConfig);
    }

    return accum;
  }, new Map());

  // Keys that existed before that no longer exist, should be subject to cancellation
  const cancelKeys = difference(prevQueryKeys, queryKeys).filter(Boolean);

  // Keys that are new, should be subject to a new request
  const requestKeys = difference(queryKeys, prevQueryKeys).filter(Boolean);
  const requestQueryConfigs = requestKeys
    .map(queryKey => queryConfigByQueryKey.get(queryKey))
    .filter(Boolean);

  return { cancelKeys, requestQueryConfigs };
};

const useMultiRequest = <Config>(mapPropsToConfigs: MapPropsToConfigs<Config>, props: Config) => {
  const reduxDispatch = useDispatch();

  const previousQueryConfigs = React.useRef<Array<QueryConfig>>([]);

  // This hook manually tracks the pending state, which is synchronized as precisely as possible
  // with the Redux state. This may seem a little hacky, but we're trying to avoid any asynchronous
  // synchronization. Hence why the pending state here is using a ref and it is updated via a
  // synchronous callback, which is called from the redux-query query middleware.
  const pendingRequests = React.useRef<Set<QueryKey>>(new Set());

  // These "const callbacks" are memoized across re-renders. Unlike useCallback, useConstCallback
  // guarantees memoization, which is relied upon elsewhere in this hook to explicitly control when
  // certain side effects occur.
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
    if (pendingRequests.current.has(queryKey)) {
      reduxDispatch(cancelQuery(queryKey));
      pendingRequests.current.delete(queryKey);
    }
  });

  const finishedCallback = useConstCallback((queryKey: ?QueryKey) => {
    return () => {
      if (queryKey != null) {
        pendingRequests.current.delete(queryKey);
      }
    };
  });

  const transformQueryConfig = useConstCallback(
    (queryConfig: ?QueryConfig): ?QueryConfig => {
      return {
        ...queryConfig,
        unstable_preDispatchCallback: finishedCallback(getQueryKey(queryConfig)),
        retry: true,
      };
    },
  );

  // Query configs are memoized based on query key. As long as the query keys in the list don't
  // change, the query config list won't change.
  const queryConfigs = useMemoizedQueryConfigs(
    normalizeToArray(mapPropsToConfigs(props)),
    transformQueryConfig,
  );

  const forceRequest = React.useCallback(() => {
    queryConfigs.forEach(requestReduxAction => {
      dispatchRequestToRedux({
        ...requestReduxAction,
        force: true,
      });
    });
  }, [dispatchRequestToRedux, queryConfigs]);

  React.useEffect(() => {
    // Whenever the list of query configs change, we need to manually diff the query configs
    // against the previous list of query configs. Whatever was there and is no longer, will be
    // cancelled. Whatever is new, will turn into a request.
    const { cancelKeys, requestQueryConfigs } = diffQueryConfigs(
      previousQueryConfigs.current,
      queryConfigs,
    );

    requestQueryConfigs.forEach(dispatchRequestToRedux);
    cancelKeys.forEach(queryKey => dispatchCancelToRedux(queryKey));

    previousQueryConfigs.current = queryConfigs;
  }, [dispatchCancelToRedux, dispatchRequestToRedux, queryConfigs]);

  // When the component unmounts, cancel all pending requests
  React.useEffect(() => {
    return () => {
      [...pendingRequests.current].forEach(dispatchCancelToRedux);
    };
  }, [dispatchCancelToRedux]);

  return forceRequest;
};

type Wrapper<Config> = (
  WrappedComponent: React.AbstractComponent<Config>,
) => React.AbstractComponent<$Diff<Config, { forceRequest: () => void }>>;

/**
 * This is the higher-order component code. Some of the code here was influenced by react-redux's
 * `connectAdvanced` implementation.
 *
 * See https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js
 * react-redux is licensed under the MIT License. Copyright (c) 2015-present Dan Abramov.
 */
const connectRequest = <Config: {}>(
  mapPropsToConfigs: MapPropsToConfigs<Config>,
  options: ?Options,
): Wrapper<Config> => WrappedComponent => {
  const { pure = true, forwardRef = false } = options || {};

  const ConnectRequestFunction = (props: Config) => {
    const forceRequest = useMultiRequest<Config>(mapPropsToConfigs, props);

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
