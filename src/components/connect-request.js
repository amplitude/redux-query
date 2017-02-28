import partial from 'lodash.partial';
import difference from 'lodash.difference';
import includes from 'lodash.includes';
import intersection from 'lodash.intersection';
import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import { requestAsync, cancelQuery } from '../actions';
import getQueryKey from '../lib/get-query-key';
import storeShape from '../lib/store-shape';

const ensureArray = (maybe) => {
    return Array.isArray(maybe) ? maybe : [maybe];
};

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

const connectRequest = (mapPropsToConfigs, options = {}) => (WrappedComponent) => {
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
                return shallowCompare(this, nextProps, nextState);
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
            const requestConfigs = configs.filter((c) => {
                return includes(requestKeys, getQueryKey(c.url, c.body));
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
            const { dispatch } = this.context.store;
            const pendingKeys = Object.keys(this._pendingRequests);

            ensureArray(cancelKeys)
            .filter((key) => includes(pendingKeys, key))
            .forEach((queryKey) => dispatch(cancelQuery(queryKey)));
        }

        requestAsync(configs, force = false, retry = false) {
            // propsToConfig mapping has happened already
            ensureArray(configs).filter(Boolean).forEach((c) => {
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
            const configs = mapPropsToConfigs(this.props);
            const forceRequest = partial(this.requestAsync.bind(this), configs, true, false);

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
