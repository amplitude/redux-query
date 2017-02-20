import toArray from 'lodash.toarray';
import partial from 'lodash.partial';
import difference from 'lodash.difference';
import intersection from 'lodash.intersection';
import React from 'react';
import shallowEqual from 'react-pure-render/shallowEqual';

import { requestAsync, cancelQuery } from '../actions';
import getQueryKey from '../lib/get-query-key';
import storeShape from '../lib/store-shape';

const unpackConfigQueryKeys = (c) => {
    return getQueryKey(c.url, c.body);
};

const diffConfigs = (prevConfigs, configs) => {
    const prevQueryKeys = prevConfigs.map(unpackConfigQueryKeys);
    const queryKeys = configs.map(unpackConfigQueryKeys);

    const intersect = intersection(prevQueryKeys, queryKeys);
    const cancelKeys = difference(prevQueryKeys, intersect);
    const requestKeys = difference(queryKeys, intersect);

    return { cancelKeys, requestKeys };
};

const connectRequest = (mapPropsToConfig, options = {}) => (WrappedComponent) => {
    const { pure = true, withRef = false } = options;

    class ReduxQueryContainer extends React.Component {
        constructor() {
            super();

            // A set of URLs that identify all pending requests
            this._pendingRequests = {};
            this._wrappedInstance = null;
        }

        shouldComponentUpdate(nextProps, nextState) {
            if (pure) {
                return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
            } else {
                return true;
            }
        }

        componentDidMount() {
            const configs = mapPropsToConfig(this.props);
            this.requestAsync(configs, false, true);
        }

        componentDidUpdate(prevProps) {
            const prevConfigs = toArray(mapPropsToConfig(prevProps)).filter(Boolean);
            const configs = toArray(mapPropsToConfig(this.props)).filter(Boolean);

            const { cancelKeys, requestKeys } = diffConfigs(prevConfigs, configs);
            const requestConfigs = prevConfigs.filter((c) => {
                return requestKeys.includes(getQueryKey(c.url, c.body));
            });

            if (cancelKeys.length) {
                this.cancelPendingRequests(cancelKeys);
            }
            if (requestConfigs.length) {
                this.requestAsync(requestConfigs);
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
            const { dispatch } = this.context.store;
            toArray(cancelKeys).filter(Boolean).forEach((queryKey) => {
                dispatch(cancelQuery(queryKey));
            });
        }

        requestAsync(configs, force = false, retry = false) {
            // propsToConfig mapping has happened already
            toArray(configs).filter(Boolean).forEach((c) => {
                this.makeRequest(c, force, retry);
            });
        }

        makeRequest(config, force, retry) {
            const { dispatch } = this.context.store;
            const { url, body } = config;

            if (url) {
                const requestPromise = dispatch(requestAsync({
                    force,
                    retry,
                    ...config,
                }));

                if (requestPromise) {
                    // Record pending request since a promise was returned
                    const queryKey = getQueryKey(url, body);
                    this._pendingRequests[queryKey] = null;

                    requestPromise.then(() => {
                        delete this._pendingRequests[queryKey];
                    });
                }
            }
        }

        render() {
            const forceRequest = partial(this.requestAsync.bind(this), this.props, true, false);

            if (withRef) {
                return (
                    <WrappedComponent
                        {...this.props}
                        forceRequest={forceRequest}
                        ref={(ref) => {
                            this._wrappedInstance = ref;
                        }}
                    />
                );
            } else {
                return (
                    <WrappedComponent
                        {...this.props}
                        forceRequest={forceRequest}
                    />
                );
            }
        }
    }

    ReduxQueryContainer.displayName = `ReduxQueryContainer(${WrappedComponent.displayName})`;
    ReduxQueryContainer.contextTypes = {
        store: storeShape,
    };

    return ReduxQueryContainer;
};

export default connectRequest;
