import hoistStatics from 'hoist-non-react-statics';
import React from 'react';
import { useDispatch } from 'react-redux';
import { requestAsync, cancelQuery } from 'redux-query/src/actions';
import { getQueryKey } from 'redux-query/src/lib/query-key';

import useConstCallback from '../hooks/use-const-callback';

const normalizeToArray = maybe => {
  return (Array.isArray(maybe) ? maybe : [maybe]).filter(Boolean);
};

const difference = (a, b) => {
  const bSet = new Set(b);

  return a.filter(x => !bSet.has(x));
};

const getDiff = (prevQueryConfigs, queryConfigs) => {
  const prevQueryKeys = prevQueryConfigs.map(getQueryKey);
  const queryKeys = queryConfigs.map(getQueryKey);
  const queryConfigByQueryKey = queryKeys.reduce((accum, queryKey, i) => {
    accum.set(queryKey, queryConfigs[i]);

    return accum;
  }, new Map());

  const cancelKeys = difference(prevQueryKeys, queryKeys);
  const requestKeys = difference(queryKeys, prevQueryKeys);
  const requestQueryConfigs = requestKeys.map(queryKey => queryConfigByQueryKey.get(queryKey));

  return { cancelKeys, requestQueryConfigs };
};

const useMemoizedQueryConfigs = (mapPropsToConfigs, props, callback) => {
  const queryConfigs = normalizeToArray(mapPropsToConfigs(props)).map(queryConfig => ({
    ...queryConfig,
    unstable_preDispatchCallback: () => callback(getQueryKey(queryConfig)),
  }));
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

  const pendingRequests = React.useRef(new Set());

  const dispatchRequestToRedux = useConstCallback(queryConfig => {
    const promise = reduxDispatch(requestAsync(queryConfig));

    if (promise) {
      pendingRequests.current.add(getQueryKey(queryConfig));
    }
  });

  const dispatchCancelToRedux = useConstCallback(queryConfig => {
    reduxDispatch(cancelQuery(queryConfig));
    pendingRequests.current.delete(getQueryKey(queryConfig));
  });

  const queryConfigs = useMemoizedQueryConfigs(mapPropsToConfigs, props, queryKey => {
    pendingRequests.current.delete(queryKey);
  });

  React.useEffect(() => {
    const { cancelKeys, requestQueryConfigs } = getDiff(previousQueryConfigs.current, queryConfigs);

    requestQueryConfigs.forEach(dispatchRequestToRedux);
    cancelKeys.forEach(dispatchCancelToRedux);

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

const connectRequest = (mapPropsToConfigs, options = {}) => WrappedComponent => {
  const { pure = true, forwardRef = false } = options;

  const ConnectRequestFunction = props => {
    const forceRequest = useMultiRequest(mapPropsToConfigs, props);

    return <WrappedComponent {...props} forceRequest={forceRequest} />;
  };

  const ConnectRequest = pure ? React.memo(ConnectRequestFunction) : ConnectRequestFunction;
  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  const displayName = `ConnectRequest(${wrappedComponentName})`;

  ConnectRequest.WrappedComponent = WrappedComponent;
  ConnectRequest.displayName = displayName;

  if (forwardRef) {
    const forwarded = React.forwardRef((props, ref) => (
      <ConnectRequest {...props} forwardedRef={ref} />
    ));

    forwarded.displayName = displayName;
    forwarded.WrappedComponent = WrappedComponent;

    return hoistStatics(forwarded, WrappedComponent);
  }

  return hoistStatics(ConnectRequest, WrappedComponent);
};

export default connectRequest;
