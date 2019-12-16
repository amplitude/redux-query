// @flow

import hoistStatics from 'hoist-non-react-statics';
import * as React from 'react';

import type { QueryConfig } from 'redux-query/types.js.flow';

import useRequests from '../hooks/use-requests';

type MapPropsToConfigs<T> = (props: T) => QueryConfig | Array<QueryConfig>;

type Options = {|
  forwardRef?: boolean,
  pure?: boolean,
|};

const normalizeToArray = (maybe: QueryConfig | Array<QueryConfig>): ?Array<QueryConfig> => {
  return (Array.isArray(maybe) ? maybe : [maybe]).filter(Boolean);
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
    const queryConfigs = normalizeToArray(mapPropsToConfigs(props));

    const [, forceRequest] = useRequests(queryConfigs);

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
