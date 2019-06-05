/**
 * Mounting and Unmounting
 * =======================
 *
 * This example extends the "Hello World" example to demo `connectRequest`
 * cancellation when the component unmounts.
 *
 * It also demonstrates how setting `force` to `true` in a query config changes
 * the loading behavior.
 *
 * Click on the "Mount Hello World Component" to render the component and
 * initiate a request. Click the button again to unmount it. If you unmount the
 * component faster than it takes for the server to respond (1s), then the
 * requst is cancelled.
 *
 * Once a request is successful, unmounting and remounting the component won't
 * trigger more requests. However, you can override this behavior by enabling
 * "force". A "Loading..." label will appear to indicate when a request is
 * in-flight.
 *
 * View the "Redux Log" tab to see the actions that are dispatched.
 * Notice the "@@query/CANCEL_QUERY" actions that are dispatched when
 * redux-query cancels requests.
 */

/**
 * Imports
 * -------
 *
 * Available packages: react, redux, react-redux, and redux-query.
 */

import React, { Component } from 'react';
import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { connect, Provider } from 'react-redux';
import { entitiesReducer, queriesReducer, queryMiddleware, querySelectors } from 'redux-query';
import { connectRequest } from 'redux-query-react';
/**
 * Set up redux and redux-query
 * ----------------------------
 */

// Include the queries and entities reducer with your other reducers.
const reducer = combineReducers({
  entities: entitiesReducer,
  queries: queriesReducer,
});

// Tell redux-query where the queries and entities reducers are.
const middleware = queryMiddleware(
  mockNetworkInterface,
  state => state.queries,
  state => state.entities,
);

const store = createStore(reducer, applyMiddleware(middleware));

/**
 * Application code
 * ----------------
 */

const helloRequest = (force = false) => ({
  url: '/api/hello',
  update: {
    message: (prev, next) => next,
  },
  force,
});

class HelloWorld extends Component {
  render() {
    const { props } = this;
    return (
      <div>
        <div>{props.isLoading && <em>Loading...</em>}</div>
        <h1>{props.message ? <span>Hello, {props.message}!</span> : <span>Hello?</span>}</h1>
      </div>
    );
  }
}

// Map redux state to props. This is ordinary react-redux usage – we're just
// reading from the entities state.
const mapStateToProps = state => ({
  isLoading: querySelectors.isPending(state.queries, helloRequest()),
  message: state.entities.message,
});

// Map props from `mapStateToProps` to a request query config.
const mapPropsToConfigs = props => helloRequest(props.force);

const HelloWorldContainer = compose(
  connect(mapStateToProps),
  connectRequest(mapPropsToConfigs),
)(HelloWorld);

class App extends Component {
  state = {
    componentMounted: false,
    isForceEnabled: false,
  };

  render() {
    const { state } = this;
    return (
      <Provider store={store}>
        <div>
          {state.componentMounted ? (
            <button
              onClick={() => {
                this.setState({
                  componentMounted: false,
                });
              }}
            >
              Unmount Hello World Component
            </button>
          ) : (
            <button
              onClick={() => {
                this.setState({
                  componentMounted: true,
                });
              }}
            >
              Mount Hello World Component
            </button>
          )}
          <label>
            <input
              type="checkbox"
              value={state.isForceEnabled}
              onChange={e => {
                this.setState({
                  isForceEnabled: e.target.checked,
                });
              }}
            />
            Force
          </label>
          <hr />
          {state.componentMounted && <HelloWorldContainer force={state.isForceEnabled} />}
        </div>
      </Provider>
    );
  }
}

// The default export should be the main React component.
export default App;
