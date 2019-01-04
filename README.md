# redux-query

[![Travis](https://img.shields.io/travis/amplitude/redux-query.svg?style=flat-square)](https://travis-ci.org/amplitude/redux-query)
[![npm](https://img.shields.io/npm/v/redux-query.svg?style=flat-square)](https://www.npmjs.com/package/redux-query)
[![Codecov](https://img.shields.io/codecov/c/github/amplitude/redux-query.svg?style=flat-square)](https://codecov.io/gh/amplitude/redux-query)

`redux-query` is a library for querying and managing network state in React/Redux applications. Brought to you by [Amplitude](https://amplitude.com/engineering).

With `redux-query` you can:

- Declare your network dependencies right next to your React components. Data is requested automatically when components mount. When components update and unmount, in-flight requests are automatically cancelled.
- Trigger server-side changes (mutations) by dispatching regular Redux actions.
- Have a consistent, minimal-boilerplate interface for all network-related state.
- Transform and normalize data to avoid duplicate state.
- Perform optimistic updates.
- Use with other Redux middleware libraries like [redux-thunk](https://github.com/gaearon/redux-thunk) and [redux-saga](https://github.com/redux-saga/redux-saga).
- Debug network state and actions with Redux dev tools like [redux-logger](https://github.com/evgenyrodionov/redux-logger).

## Getting Started

Install `redux-query` via npm:

```
$ npm install --save redux-query
```

Add the `entitiesReducer` and `queriesReducer` to your combined reducer.

Include the `queryMiddleware` in your store's `applyMiddleware` call. `queryMiddleware` requires two arguments: a selector (or function) that returns entities state, and a function for the queries state.

For example:

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

## Interactive Demos

There are several interactive demos at [https://amplitude.github.io/redux-query](https://amplitude.github.io/redux-query):

- [Hello World](https://amplitude.github.io/redux-query/#/hello-world)
- [Mounting and Unmounting](https://amplitude.github.io/redux-query/#/mounting)
- [Updating from Props](https://amplitude.github.io/redux-query/#/updating)
- [Mutations](https://amplitude.github.io/redux-query/#/mutations)
- [Usage with redux-saga](https://amplitude.github.io/redux-query/#/redux-saga)
- [Hacker News](https://amplitude.github.io/redux-query/#/hacker-news)

After making code changes, click the "Run" button above the code editor to view your changes.

Most of these demos use a mock server, which lets you also experiment with different server logic. Click on the "Mock Server" tab above the code editor to view and modify the mock server logic. In addition, you can view the log of redux actions and states by clicking on the "Redux Log" tab.

## Dependencies

All dependencies are listed in [`package.json`](./package.json). Redux and React are peer dependencies. HTTP requests are made using [superagent](https://github.com/visionmedia/superagent).

## Usage and API

### Requests and mutations

There are two types of queries with `redux-query`: "requests" and "mutations". Requests are for reading values from HTTP endpoints. Mutations are for HTTP endpoints that change network state – the "C", "U", and "D" in "CRUD".

Requests can be triggered from the `connectRequest` higher-order component or a `requestAsync` action. Mutations are triggered by dispatching a `mutateAsync` action.

By default, requests are GETs and mutations are POSTS.

### Query configs

Query configs are objects used to describe how redux-query should handle the request or mutation. Query config options differ slightly between requests and mutations

#### Request query config options

| Name | Type | Required? | Description |
|:---|:---|:---:|:---|
| `url` | string | yes | The URL for the HTTP request. |
| `transform` | function |  | A function that transforms the response data to an entities object where keys are entity IDs and values are entity data. Can be used to normalize data. |
| `update` | object | yes | An object where keys are entity IDs and values are "update functions" (see below). |
| `body` | object |  | The request body. For GETs, this object is stringified and appended to the URL as query params. |
| `force` | boolean |  | A flag to indicate that the request should be performed even if a previous query with the same query key succeeded. |
| `queryKey` | string |  | The identifier used to identify the query metadata in the `queries` reducer. If unprovided, the `url` and `body` fields are serialized to generate the query key. |
| `meta` | object |  | Various metadata for the query. Can be used to update other reducers when queries succeed or fail. |
| `options` | object |  | Options for the request. Set `options.method` to change the HTTP method, `options.headers` to set any headers and `options.credentials = 'include'` for CORS. |

#### Mutation query config options

| Name | Type | Required? | Description |
|:---|:---|:---:|:---|
| `url` | string | yes | The URL for the HTTP request. |
| `transform` | function |  | A function that transforms the response data to an entities object where keys are entity IDs and values are entity data. Can be used to normalize data. |
| `update` | object | yes | An object where keys are entity IDs and values are "update functions" (see below). |
| `optimisticUpdate` | object |  | An object where keys are entity IDs and values are "optimisticUpdate functions" (see below). Used to update entities immediately when the mutation starts. |
| `rollback` | object |  | An object where keys are entity IDs and values are "rollback functions" (see below). Used to reverse the effects of `optimisticUpdate` when the mutation fails. If not provided, the entity will simply be reverted to its value before the `optimisticUpdate` was performed. |
| `body` | object |  | The HTTP request body. For GETs, this object is stringified and appended to the URL as query params. |
| `queryKey` | string |  | The identifier used to identify the query metadata in the `queries` reducer. If unprovided, the `url` and `body` fields are serialized to generate the query key. |
| `meta` | object |  | Various metadata for the query. Can be used to update other reducers when queries succeed or fail. |
| `options` | object |  | Options for the request. Set `options.method` to change the HTTP method, `options.headers` to set any headers and `options.credentials = 'include'` for CORS. |

### `transform` functions

`transform` functions let you process and normalize response data before it is passed to the `update` step. They have the following signature:

```javascript
(responseJson: ?Object, responseText: string) => { [key: string]: any }
```

If your data is normalized on the server, you may not need to use this function.

### `update` functions

`update` functions are responsible for reconciling response data with the existing `entities` reducer data for the given entity ID. They have the following signature:

```javascript
(prevValue: any, transformedValue: any) => any
```

The `prevValue` is the whatever value is selected from the `entities` reducer for the respective entity ID. The returned value from this function will become the new value for the entity ID in the `entities` reducer.

### `optimisticUpdate` functions

`optimisticUpdate` functions are just like update functions except they only pass the `prevValue`:

```javascript
(prevValue: any) => any
```

### `rollback` functions

`rollback` functions are used to reverse the effect of `optimisticUpdate`s when the mutation fails. They are provided two parameters: the state of the entity before the optimistic update and the current state of the entity:

```javascript
(initialValue: any, currentValue: any) => any
```

Specifying `rollback` functions are not required. However, it is recommended for entities that are partially updated (e.g. an object collection of items keyed by IDs). The default `rollback` behavior is equivalent to the following:

```javascript
(initialValue, currentValue) => initialValue
```

### `connectRequest`

Use the `connectRequest` higher-order component to declare network dependencies for a React component.

`connectRequest` takes a function, `mapPropsToConfigs`, that transforms the component `props` to a request query config or an array of request query configs. You can think of `mapPropsToConfigs` similarly to `react-redux`'s `mapStateToProps` and `mapDispatchToProps`.

On mount, every query config returned from `mapPropsToConfigs` will result in a dispatched `requestAsync` Redux action. When the props update, `mapPropsToConfigs` is called again. All pending requests that were removed will be cancelled and all new configs will result in a dispatched `requestAsync` Redux action. On unmount, all pending requests will be cancelled.

Please note, just because a `requestAsync `Redux action was dispatched, does not mean that an actual network request will occur. Requests that were previously successful will not result in another network request, unless the corresponding query config has `force` set to `true`.

99% of the time you'll be using `react-redux`'s `connect` at the same time when you are using `connectRequest`. You might find using `redux`'s `compose` function makes this a bit more elegant.

Example usage:

```javascript
import { compose } from 'redux';
import { connectRequest } from 'redux-query';
import { connect } from 'react-redux';

class Dashboard extends Component {
  ...
}

const mapStateToProps = (state, props) => ({
  dashboard: getDashboard(state, props),
});

const mapPropsToConfigs = props => [
  {
    url: `/api/dashboard/${props.dashboardId}`,
    update: {
      chartsById: (prevCharts, dashboardCharts) => ({
        ...prevCharts,
        ...dashboardCharts,
      }),
      dashboardsById: (prevDashboards, dashboards) => ({
        ...prevDashboards,
        ...dashboards,
      }),
    },
  }
];

export default compose(
  connect(mapStateToProps),
  connectRequest(mapPropsToConfigs)
)(Dashboard);
```

`connectRequest` passes an extra prop to the child component: `forceRequest`. Calling this function will cause the request(s) to be made again. This may be useful for polling or creating an interface to trigger refreshes.

For configurability, `connectRequest` accepts an optional `options` argument, which
may be set to an object specifying custom values for any of the following:


| Name | Type | Description |
|:---|:---|:---:|:---|
| `pure` | boolean | Re-renders based on a shallow comparison of the props passed to the `connectRequest`ed component instead of once per render of the parent. |
| `withRef` | boolean | Allows access to the wrapped component via call to `.getWrappedInstance()`. |
| `reduxContext` | object | Allows custom connection to a Redux context (e.g. for use with react-redux >= 6.0.0). |

### `mutateAsync`

Dispatch `mutateAsync` Redux actions to trigger mutations. `mutateAsync` takes a mutation query config as its only argument. Example usage with a [react-redux](https://github.com/reactjs/react-redux)-connected component:

```javascript
// src/queries/dashboard.js

export const createUpdateDashboardQuery = (dashboardId, newName) => ({
  url: `/api/${dashboardId}/update`,
  body: {
    name: newName,
  },
  update: {
    dashboardsById: (prevDashboardsById, newDashboardsById) => ({
      ...prevDashboardsById,
      ...newDashboardsById,
    }),
  },
});

// src/actions/dashboard.js

import { mutateAsync } from 'redux-query';
import { createUpdateDashboardQuery } from '../queries/dashboard';

export const updateDashboard = (dashboardId, newName) => {
  return mutateAsync(createUpdateDashboardQuery(dashboardId, newName));
};

// src/selectors/dashboard.js

export const getDashboard = (state, { dashboardId }) => {
  if (state.entities.dashboardsById) {
    return state.entities.dashboardsById[dashboardId];
  } else {
    return null;
  }
};

// src/components/Dashboard.jsx

import { connect } from 'react-redux';

import { updateDashboard } from '../actions/dashboard';
import { getDashboard } from '../selectors/dashboard';

class Dashboard extends Component {
  ...
}

const mapStateToProps = (state, props) => {
  return {
    dashboard: getDashboard(state, props),
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    changeName: (newName) => {
      dispatch(updateDashboard(props.dashboardId, newName));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
```

When dispatching a `mutateAsync` action, you can Promise-chain on the returned value from `dispatch`:

```javascript
const mapDispatchToProps = (dispatch, props) => {
  return {
    changeName: (newName) => {
      dispatch(updateDashboard(props.dashboardId, newName)).then((result) => {
        if (result.status !== 200) {
          dispatch(showUpdateDashboardFailedNotification(props.dashboardId));
        }
      });
    },
  };
};
```

The result of the promise returned by `mutateAsync` will be the following object:

| Name | Type | Description |
|:-----|:-----|:-----|
| status | number | HTTP status code.
| body | object or null | Parsed response body.
| text | string | Unparsed response body string.
| duration | number | The total duration from the start of the query to receiving the full response.

When the mutation succeeds, it will also include the following fields:

| Name | Type | Description |
|:-----|:-----|:-----|
| transformed | any | Result from the transform function. Will be identical to body if transform is unprovided in the query config.
| entities | object | The new, updated entities that have been affected by the query.

### `requestAsync`

Similarly to how mutations are triggered by dispatching `mutateAsync` actions, you can trigger requests by dispatching `requestAsync` actions with a request query config.

You can also Promise-chain on dispatched `requestAsync` actions, but a Promise will only be returned if `redux-query` determines it will make a network request. For example, if the query config does not have `force` set to `true` and a previous request with the same query key previously succeeded, then a Promise will not be returned. So be sure to always check that the returned value from a dispatched `requestAsync` is a Promise before interacting with it.

### Queries selectors

`redux-query` provides some useful selectors for reading from the queries reducer state:

| Selector Name | Return Type | Description |
|:-----|:-----|:-----|
| isFinished | ?boolean | Returns `true` if the query was resolved or cancelled.
| isPending | ?boolean | Returns `true` if the query is in-flight – not resolved and not cancelled.
| status | ?number | Response HTTP status code.
| lastUpdated | ?number | Time at which the query was resolved.
| queryCount | ?number | Number of times a query was started with the same query key.

All of the query selectors have the following signature:

`(queriesReducerState, queryConfig) => mixed`

### Errors reducer and selectors

`redux-query` provides another reducer for applications that want to track response body, text, and headers in redux state. Unlike the entities and queries reducers, `errorsReducer` is totally optional. If you include this reducer in your application's combined reducer, all responses from requests and mutations with non-2xx status codes will be recorded in this state.

Note: If your application has many queries that could potentially error and is used for long periods of time, you should avoid using this reducer as it could potentially accumulate a lot of memory usage. You can alternatively build your own reducer to track a subset of queries, or rely on the promise interface to handle error responses in an ad-hoc manor.

You can query from this state using the provided `errorSelectors`:

| Selector Name | Return Type | Description |
|:-----|:-----|:-----|
| responseBody | ?Object | Parsed response body (if query failed).
| responseText | ?string | Unparsed response body string (if query failed).
| responseHeaders | ?Object | Response headers (if query failed).

All of the query selectors have the following signature:

`(errorsReducerState, queryConfig) => mixed`

### Custom network interfaces

By default, `redux-query` makes XHR requests using the [superagent](https://github.com/visionmedia/superagent) library. If you'd rather use a different library for making requests, you can use `redux-query`'s `queryMiddlewareAdvanced` middleware.

If you use a custom network interface and want to avoid including superagent in your bundle, change all of your imports from `redux-query` to `redux-query/advanced`.

Note: The default [`queryMiddleware`](./src/middleware/query.js) exported from the main `redux-query` entry point is simply a [superagent network interface](./src/network-interfaces/superagent.js) bound to `queryMiddlewareAdvanced`.

Network interfaces have the following interface:

```javascript
type NetworkInterface = (
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  config?: { body?: string | Object, headers?: Object, credentials?: 'omit' | 'include' } = {},
) => NetworkHandler;

type NetworkHandler = {
  execute: (callback: (err: any, resStatus: number, resBody: ?Object, resText: string, resHeaders: Object) => void) => void,
  abort: () => void,
};
```

Example `queryMiddlewareAdvanced` usage:

```javascript
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { entitiesReducer, queriesReducer, queryMiddlewareAdvanced } from 'redux-query/advanced';

// A function that takes a url, method, and other options. This function should return an object
// with two required properties: execute and abort.
import myNetworkInterface from './network-interface';

export const getQueries = (state) => state.queries;
export const getEntities = (state) => state.entities;

const reducer = combineReducers({
  entities: entitiesReducer,
  queries: queriesReducer,
});

const store = createStore(
  reducer,
  applyMiddleware(queryMiddlewareAdvanced(myNetworkInterface)(getQueries, getEntities))
);
```

## Example

A fork of the `redux` [Async](https://github.com/reactjs/redux/tree/master/examples/async) example is included. To run, first build the package:

```sh
$ yarn install
$ yarn run build
```

Then you can run the example:

```sh
$ cd examples/async
$ yarn install
$ yarn run start
```
