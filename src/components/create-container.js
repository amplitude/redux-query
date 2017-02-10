import identity from 'lodash/identity';
import React, { Component } from 'react';
import partial from 'lodash/partial';

import { requestAsync } from '../actions';
import storeShape from '../lib/store-shape';

const createContainer = (mapPropsToUrl, mapStateToRequests, mapPropsToTransform) => (WrappedComponent) => {
    class ReduxQueryContainer extends Component {
        componentDidMount() {
            this.fetch(this.props);
        }

        componentWillUpdate(nextProps) {
            this.fetch(nextProps);
        }

        fetch(props, force = false) {
            const { dispatch } = this.context.store;
            const url = mapPropsToUrl(props);
            const transform = mapPropsToTransform ? mapPropsToTransform(props) : identity;
            dispatch(requestAsync(url, mapStateToRequests, transform, force));
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    forceRequest={partial(this.fetch.bind(this), this.props, true)}
                />
            );
        }
    }

    ReduxQueryContainer.displayName = `ReduxQueryContainer(${WrappedComponent.displayName})`;
    ReduxQueryContainer.contextTypes = {
        store: storeShape,
    };

    return ReduxQueryContainer;
};

export default createContainer;
