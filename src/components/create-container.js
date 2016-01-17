import React, { Component } from 'react';
import storeShape from 'react-redux/lib/utils/storeShape';
import partial from 'lodash/partial';

import { requestAsync } from '../actions';

const createContainer = (mapPropsToDeps, responsesSelector) => (WrappedComponent) => {
    class ReduxQueryContainer extends Component {
        componentDidMount() {
            this.fetch(this.props);
        }

        componentWillUpdate(nextProps) {
            this.fetch(nextProps);
        }

        fetch(props, force = false) {
            const { dispatch } = this.context.store;
            const deps = mapPropsToDeps(props);
            dispatch(requestAsync(deps.url, deps.schema, responsesSelector, force));
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
