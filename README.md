# redux-query

[![Travis](https://img.shields.io/travis/amplitude/redux-query.svg?style=flat-square)](https://travis-ci.org/amplitude/redux-query)
[![npm](https://img.shields.io/npm/v/redux-query.svg?style=flat-square)](https://www.npmjs.com/package/redux-query)
[![Codecov](https://img.shields.io/codecov/c/github/amplitude/redux-query.svg?style=flat-square)](https://codecov.io/gh/amplitude/redux-query)

`redux-query` is a library for Redux/React apps that communicate with REST APIs to query and manage network state. With `redux-query` you can:

- Declare your network dependencies right next to your React components. Data is requested automatically when components mount. When components update and unmount, in-flight requests are automatically cancelled.
- Trigger server-side effects by dispatching regular Redux actions.
- Have a consistent, boilerplate-free interface for all network-related state.
- Transform and normalize data to avoid duplicate Redux state.
- Perform optimistic updates.
- Use in conjunction with other Redux libraries [redux-thunk](https://github.com/gaearon/redux-thunk) and [redux-saga](https://github.com/redux-saga/redux-saga).
- Debug network state and actions with Redux dev tools (e.g. [redux-logger](https://github.com/evgenyrodionov/redux-logger)).

## Getting Started

### Installation

Install `redux-query` via npm:

```
$ npm install --save redux-query
```

### Setup

Add the `entities` and `queries` reducers to your combined reducer. Then add the `queryMiddleware` (which requires two arguments – one selector for the `entities` reducer state, and the other for the `queries` reducer state).

```javascript
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { entitiesReducer, queriesReducer, queryMiddleware } from 'redux-query';
import createLogger from 'redux-logger';

export const getQueries = (state) => state.queries;
export const getEntities = (state) => state.entities;

const reducer = combineReducers({
    entities: entitiesReducer,
    queries: queriesReducer,
});

const logger = createLogger();
const store = createStore(
    reducer,
    applyMiddleware(queryMiddleware(getQueries, getEntities), logger)
);
```

`queryMiddleware` is responsible for tracking `redux-query` actions, performing the queries, and dispatching resulting Redux actions that alter the queries and entities reducer states.

### Usage

## Example

### Async

This is a fork of the `redux` [Async](https://github.com/reactjs/redux/tree/master/examples/async) example.

```sh
$ cd examples/async
$ npm install
$ npm run start
```
