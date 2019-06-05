/**
 * Hello World
 * ===========
 *
 * This example demos basic usage of `connectRequest`.
 *
 * A request will be made once the application mounts and the server will
 * respond with "World". Once the response is received, the application will
 * update to render "Hello, World!"
 */

/**
 * Imports
 * -------
 *
 * Available packages: react, redux, react-redux, and redux-query
 */

import React, { Component } from 'react';
import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { connect, Provider } from 'react-redux';
import { entitiesReducer, queriesReducer, queryMiddleware } from 'redux-query';
import { connectRequest } from 'redux-query-react';

/**
 * Set up redux and redux-query
 * ----------------------------
 */

// Include the queries and entities reducer.
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

const helloRequest = () => ({
  url: '/api/hello',
  update: {
    message: (prev, next) => next,
  },
});

class HelloWorld extends Component {
  render() {
    return (
      <h1>
        {this.props.message ? <span>Hello, {this.props.message}!</span> : <span>Hello?</span>}
      </h1>
    );
  }
}

// Map redux state to props. This is ordinary react-redux usage – we're just
// reading from the entities state.
const mapStateToProps = state => ({
  message: state.entities.message,
});

// Map props from `mapStateToProps` to a request query config. In this case,
// the query config is constant (i.e. not parameterized by props).
const mapPropsToConfigs = () => helloRequest();

const HelloWorldContainer = compose(
  connect(mapStateToProps),
  connectRequest(mapPropsToConfigs),
)(HelloWorld);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <HelloWorldContainer />
      </Provider>
    );
  }
}

// The default export should be the main React component.
export default App;
