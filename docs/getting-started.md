---
id: getting-started
title: Getting Started
---

## Install with React support

Requirements:

- Redux 4.0 or later
- React Redux 7.1.0 or later
- React 16.8.6 or later

To install with npm:

```bash
npm install --save redux-query redux-query-react redux-query-interface-superagent
```

or yarn:

```bash
yarn add redux-query redux-query-react redux-query-interface-superagent
```

Note: redux-query-interface-superagent is the recommended default [network interface](network-interfaces). If you'd rather use a different network request library, you don't need to install redux-query-interface-superagent. Instead, you will need to build your own network interface.

## Install without React support

Requirements:

- Redux 4.0 or later

To install with npm:

```bash
npm install --save redux-query redux-query-interface-superagent
```

or yarn:

```bash
yarn add redux-query redux-query-interface-superagent
```

Note: redux-query-interface-superagent is the recommended default network interface. If you'd rather use a different network request library, you don't need to install redux-query-interface-superagent. Instead, you will need to build your own network interface.

## Configure Redux

Add the `entitiesReducer` and `queriesReducer` to your combined reducer.

Include the `queryMiddleware` in your store's `applyMiddleware` call. `queryMiddleware` requires two arguments: a selector that returns entities state, and a selector for the queries state.

```javascript
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { entitiesReducer, queriesReducer, queryMiddleware } from 'redux-query';
import superagentInterface from 'redux-query-interface-superagent';

export const getQueries = (state) => state.queries;
export const getEntities = (state) => state.entities;

const reducer = combineReducers({
  entities: entitiesReducer,
  queries: queriesReducer,
});

const store = createStore(
  reducer,
  applyMiddleware(queryMiddleware(superagentInterface, getQueries, getEntities)),
);

export default store;
```

## React setup

Import `Provider` from redux-query-react and render it at the root of your React hierarchy.

```javascript
import * as React from 'react';
import { Provider } from 'react-redux';
import { Provider as ReduxQueryProvider } from 'redux-query-react';

import App from './App';
import store from './store';

export const getQueries = (state) => state.queries;

const Root = () => {
  return (
    <Provider store={store}>
      <ReduxQueryProvider queriesSelector={getQueries}>
        <App />
      </ReduxQueryProvider>
    </Provider>
  );
};

export default Root;
```
