import partial from 'lodash.partial';
import difference from 'lodash.difference';
import intersection from 'lodash.intersection';
import React from 'react';
import shallowEqual from 'react-pure-render/shallowEqual';

import { requestAsync, cancelQuery } from '../actions';
import getQueryKey from '../lib/get-query-key';
import storeShape from '../lib/store-shape';

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
            const configs = mapPropsToConfig(configs);
            if (Array.isArray(configs)) {
                this.requestAsync(configs, false, true);
            } else {
                this.requestAsync(this.props, false, true);
            }
        }

        componentDidUpdate(prevProps) {
            let prevConfigs = mapPropsToConfig(prevProps);
            let configs = mapPropsToConfig(this.props);
            if (!Array.isArray(prevConfigs)) {
                prevConfigs = [prevConfigs];
            }
            if (!Array.isArray(configs)) {
                configs = [configs];
            }

            const diffs = this._diffConfigs(prevConfigs, configs);
            const toCancel = diffs[0];
            const toRequest = diffs[1];

            if (toCancel.length) {
                this.cancelPendingRequests(toCancel);
            }
            if (toRequest.length) {
                this.requestAsync(toRequest);
            }
        }

        componentWillUnmount() {
            this.cancelPendingRequests();
        }

        getWrappedInstance() {
            return this._wrappedInstance;
        }

        // returns [[ "keys", "to", "cancel"], [{ config objects to request }]]
        _diffConfigs(prevConfigs, configs) {
            const unpack = (c) => {
                return getQueryKey(c.url, c.body);
            };
            const prevQueryKeys = prevConfigs.map(unpack);
            const queryKeys = configs.map(unpack);
            const i = intersection(prevQueryKeys, queryKeys);
            const cancelKeys = difference(prevQueryKeys, i);
            const requestKeys = difference(queryKeys, i);

            const toRequest = prevConfigs.filter((c) => {
                const k = getQueryKey(c.url, c.body);
                return requestKeys.includes(k);
            });

            return [cancelKeys, toRequest];
        }

        cancelPendingRequests(toCancel) {
            const { dispatch } = this.context.store;
            if (toCancel && Array.isArray(toCancel)) {
                // Only cancel specific keys, supports multiple configs
                toCancel.forEach((queryKey) => {
                    if (this._pendingRequests.hasOwnProperty(queryKey)) {
                        dispatch(cancelQuery(queryKey));
                    }
                });
            } else {
                for (const queryKey in this._pendingRequests) {
                    if (this._pendingRequests.hasOwnProperty(queryKey)) {
                        dispatch(cancelQuery(queryKey));
                    }
                }
            }
        }

        requestAsync(propsOrConfigs, force = false, retry = false) {
            if (Array.isArray(propsOrConfigs)) {
                // propsToConfig mapping has happened already
                propsOrConfigs.forEach((c) => {
                    this._makeRequest(c, force, retry);
                });
            } else {
                const config = mapPropsToConfig(propsOrConfigs);

                if (config) {
                    this._makeRequest(config, force, retry);
                }
            }
        }

        _makeRequest(config, force, retry) {
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
