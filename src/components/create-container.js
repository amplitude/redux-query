import React, { Component } from 'react';
import storeShape from 'react-redux/lib/utils/storeShape';

import { requestAsync } from '../actions';

const createContainer = (mapPropsToDeps, responsesSelector) => (WrappedComponent) => {
    class ReduxQueryContainer extends Component {
        componentDidMount() {
            this.fetch();
        }

        componentWillUpdate() {
            this.fetch();
        }

        fetch() {
            const { dispatch } = this.context.store;
            const deps = mapPropsToDeps(this.props);
            dispatch(requestAsync(deps.url, deps.schema, responsesSelector));
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
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
