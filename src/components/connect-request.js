import partial from 'lodash.partial';
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
            this.requestAsync(this.props, false, true);
        }

        componentDidUpdate(prevProps) {
            const prevConfig = mapPropsToConfig(prevProps);
            const config = mapPropsToConfig(this.props);
            const prevQueryKey = prevConfig && getQueryKey(prevConfig.url, prevConfig.body);
            const queryKey = config && getQueryKey(config.url, config.body);

            if (prevQueryKey !== queryKey) {
                this.cancelPendingRequests();
                this.requestAsync(this.props, false, true);
            }
        }

        componentWillUnmount() {
            this.cancelPendingRequests();
        }

        getWrappedInstance() {
            return this._wrappedInstance;
        }

        cancelPendingRequests() {
            const { dispatch } = this.context.store;

            for (const queryKey in this._pendingRequests) {
                if (this._pendingRequests.hasOwnProperty(queryKey)) {
                    dispatch(cancelQuery(queryKey));
                }
            }
        }

        requestAsync(props, force = false, retry = false) {
            const { dispatch } = this.context.store;
            const config = mapPropsToConfig(props);

            if (config) {
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
