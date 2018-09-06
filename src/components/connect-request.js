import difference from 'lodash.difference';
import includes from 'lodash.includes';
import intersection from 'lodash.intersection';
import React from 'react';

import { requestAsync, cancelQuery } from '../actions';
import { getQueryKey } from '../lib/query-key';
import shallowEqual from '../lib/shallow-equal';
import storeShape from '../lib/store-shape';

const ensureArray = maybe => {
  return Array.isArray(maybe) ? maybe : [maybe];
};

const diffConfigs = (prevConfigs, configs) => {
  const prevQueryKeys = prevConfigs.map(getQueryKey);
  const queryKeys = configs.map(getQueryKey);

  const intersect = intersection(prevQueryKeys, queryKeys);
  const cancelKeys = difference(prevQueryKeys, intersect);
  const requestKeys = difference(queryKeys, intersect);

  return { cancelKeys, requestKeys };
};

const connectRequest = (mapPropsToConfigs, options = {}) => WrappedComponent => {
  const { pure = true, withRef = false } = options;

  class ConnectRequest extends React.Component {
    constructor() {
      super();

      this.forceRequest = this.forceRequest.bind(this);

      // A set of URLs that identify all pending requests
      this._pendingRequests = {};
      this._wrappedInstance = null;
      this._resolvers = [];
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (pure) {
        return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
      } else {
        return true;
      }
    }

    componentDidMount() {
      const configs = mapPropsToConfigs(this.props);
      this.requestAsync(configs, false, true);
    }

    componentDidUpdate(prevProps) {
      const prevConfigs = ensureArray(mapPropsToConfigs(prevProps)).filter(Boolean);
      const configs = ensureArray(mapPropsToConfigs(this.props)).filter(Boolean);

      const { cancelKeys, requestKeys } = diffConfigs(prevConfigs, configs);
      const requestConfigs = configs.filter(config => {
        return includes(requestKeys, getQueryKey(config));
      });

      if (cancelKeys.length) {
        this.cancelPendingRequests(cancelKeys);
      }
      if (requestConfigs.length) {
        this.requestAsync(requestConfigs, false, true);
      }
    }

    componentWillUnmount() {
      const cancelKeys = Object.keys(this._pendingRequests);
      this.cancelPendingRequests(cancelKeys);
    }

    getWrappedInstance() {
      return this._wrappedInstance;
    }

    cancelPendingRequests(cancelKeys) {
      const cancelKeysArray = ensureArray(cancelKeys);

      if (cancelKeysArray.length > 0) {
        const { dispatch } = this.context.store;
        const pendingKeys = Object.keys(this._pendingRequests);

        cancelKeysArray
          .filter(key => includes(pendingKeys, key))
          .forEach(queryKey => dispatch(cancelQuery(queryKey)));
      }
    }

    requestAsync(configs, force = false, retry = false) {
      // propsToConfig mapping has happened already
      return ensureArray(configs)
        .filter(Boolean)
        .map(c => this.makeRequest(c, force, retry))
        .filter(Boolean);
    }

    makeRequest(config, force, retry) {
      const { dispatch } = this.context.store;

      if (config.url) {
        const queryKey = getQueryKey(config);
        const requestPromise = dispatch(
          requestAsync({
            force,
            retry,
            ...config,
            unstable_preDispatchCallback: () => {
              delete this._pendingRequests[queryKey];
              if (Object.keys(this._pendingRequests).length === 0) {
                this._resolvers.forEach(resolver => resolver());
                this._resolvers = [];
              }
            },
          }),
        );

        if (requestPromise) {
          // Record pending request since a promise was returned
          this._pendingRequests[queryKey] = requestPromise;
        }
        return requestPromise;
      }
    }

    forceRequest() {
      this.requestAsync(mapPropsToConfigs(this.props), true, false);
      return new Promise(resolve => this._resolvers.push(resolve));
    }

    render() {
      if (withRef) {
        return (
          <WrappedComponent
            {...this.props}
            forceRequest={this.forceRequest}
            ref={ref => {
              this._wrappedInstance = ref;
            }}
          />
        );
      } else {
        return <WrappedComponent {...this.props} forceRequest={this.forceRequest} />;
      }
    }
  }

  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  ConnectRequest.displayName = `ConnectRequest(${wrappedComponentName})`;
  ConnectRequest.contextTypes = {
    store: storeShape,
  };

  return ConnectRequest;
};

export default connectRequest;
