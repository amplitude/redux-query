import hoistStatics from 'hoist-non-react-statics';
import difference from 'lodash.difference';
import intersection from 'lodash.intersection';
import React from 'react';
import { useDispatch } from 'react-redux';
import { requestAsync, cancelQuery } from 'redux-query/src/actions';
import { getQueryKey } from 'redux-query/src/lib/query-key';

import useConstCallback from '../hooks/use-const-callback';

const normalizeToArray = maybe => {
  return Array.isArray(maybe) ? maybe : [maybe];
};

const getDiff = (prevActions, actions) => {
  const prevQueryKeys = prevActions.map(getQueryKey);
  const queryKeys = actions.map(getQueryKey);
  const actionByQueryKey = queryKeys.reduce((accum, queryKey, i) => {
    accum.set(queryKey, actions[i]);

    return accum;
  }, new Map());

  const intersect = intersection(prevQueryKeys, queryKeys);
  const cancelKeys = difference(prevQueryKeys, intersect);
  const requestKeys = difference(queryKeys, intersect);
  const requestActions = requestKeys.map(queryKey => actionByQueryKey.get(queryKey));

  return { cancelKeys, requestActions };
};

const useMemoizedActions = (mapPropsToConfigs, props, callback) => {
  const actions = normalizeToArray(mapPropsToConfigs(props)).map(queryConfig => ({
    ...queryConfig,
    unstable_preDispatchCallback: () => callback(getQueryKey(queryConfig)),
  }));
  const [memoizedActions, setMemoizedActions] = React.useState(actions);
  const previousQueryKeys = React.useRef(actions.map(getQueryKey));

  React.useEffect(() => {
    const queryKeys = actions.map(getQueryKey);

    if (
      queryKeys.length !== previousQueryKeys.current.length ||
      queryKeys.some((queryKey, i) => previousQueryKeys.current[i] !== queryKey)
    ) {
      previousQueryKeys.current = queryKeys;
      setMemoizedActions(actions);
    }
  }, [actions]);

  return memoizedActions;
};

const useMultiRequest = (mapPropsToConfigs, props) => {
  const reduxDispatch = useDispatch();

  const previousActions = React.useRef([]);

  const pendingRequests = React.useRef(new Set());

  const dispatchRequestToRedux = useConstCallback(action => {
    const promise = reduxDispatch(requestAsync(action));

    if (promise) {
      pendingRequests.current.add(getQueryKey(action));
    }
  });

  const dispatchCancelToRedux = useConstCallback(action => {
    reduxDispatch(cancelQuery(action));
    pendingRequests.current.delete(getQueryKey(action));
  });

  const requestReduxActions = useMemoizedActions(mapPropsToConfigs, props, queryKey => {
    pendingRequests.current.delete(queryKey);
  });

  React.useEffect(() => {
    const { cancelKeys, requestActions } = getDiff(previousActions, requestReduxActions);

    requestActions.forEach(dispatchRequestToRedux);
    cancelKeys.forEach(dispatchCancelToRedux);

    return () => {
      pendingRequests.current.values().forEach(dispatchCancelToRedux);
    };
  }, [dispatchCancelToRedux, dispatchRequestToRedux, requestReduxActions]);

  const forceRequest = React.useCallback(() => {
    requestReduxActions.forEach(requestReduxAction => {
      dispatchRequestToRedux({
        ...requestReduxAction,
        force: true,
      });
    });
  }, [dispatchRequestToRedux, requestReduxActions]);

  return forceRequest;
};

const connectRequest = (mapPropsToConfigs, options = {}) => WrappedComponent => {
  const { pure = true, forwardRef = false } = options;

  const ConnectRequestFunction = props => {
    const forceRequest = useMultiRequest(mapPropsToConfigs, props);

    return <WrappedComponent {...this.props} forceRequest={forceRequest} />;
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
