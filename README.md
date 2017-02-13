# redux-query

[![Travis](https://img.shields.io/travis/amplitude/redux-query.svg?style=flat-square)](https://travis-ci.org/amplitude/redux-query)
[![npm](https://img.shields.io/npm/v/redux-query.svg?style=flat-square)](https://www.npmjs.com/package/redux-query)
[![Codecov](https://img.shields.io/codecov/c/github/amplitude/redux-query.svg?style=flat-square)](https://codecov.io/gh/amplitude/redux-query)

`redux-query` is a library for React/Redux apps that use REST APIs to synchronize and manage network state.

With `redux-query` you can:

- Declare your network dependencies right next to your React components. Data is requested automatically when components mount. When components update and unmount, in-flight requests are automatically cancelled.
- Trigger server-side changes (mutations) by dispatching regular Redux actions.
- Have a consistent, minimal-boilerplate interface for all network-related state.
- Transform and normalize data to avoid duplicate state.
- Perform optimistic updates.
- Use in conjunction with other Redux libraries [redux-thunk](https://github.com/gaearon/redux-thunk) and [redux-saga](https://github.com/redux-saga/redux-saga).
- Debug network state and actions with Redux dev tools (e.g. [redux-logger](https://github.com/evgenyrodionov/redux-logger)).

## Getting Started

Install `redux-query` via npm:

```
$ npm install --save redux-query
```

Add the `entitiesReducer` and `queriesReducer` to your combined reducer.

Include the `queryMiddleware` to your store's `applyMiddleware` call. `queryMiddleware` requires two arguments: a function (selector) that returns entities state, and a function for the queries state.

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

## Usage and API

### Requests and mutations

There are two types of queries with `redux-query`: "requests" and "mutations". Requests are for reading values from HTTP endpoints. Mutations are for HTTP endpoints that change network state – the "C", "U", and "D" in "CRUD".

Requests can be triggered from the `connectRequest` higher-order component or a `requestAync` action. Mutations are triggered by dispatching a `mutateAsync` action.

By default, requests are GETs and mutations are POSTS.

### Query configs

Query configs are objects used to describe how redux-query should handle the request or mutation.

Query configs for requests have the following options:

| Name | Type | Required? | Description |
|:---|:---|:---:|:---|
| `url` | string | yes | The URL for the HTTP request. |
| `transform` | function |  | Function that transforms the response data to an entities object where keys are entity IDs and values are entity data. Can be used to normalize data. |
| `update` | object | yes | Object where keys are entity IDs and values are update functions. |
| `body` | object |  | The request body. |
| `force` | boolean |  | Perform the request even if we've already successfully requested it. |
| `queryKey` | string |  | The identifier used to identify the query metadata in the `queries` reducer. If unprovided, the `url` and `body` fields are serialized to generate the query key. |
| `meta` | object |  | Various metadata for the query. Can be used to update other reducers when queries succeed or fail. |
| `options` | object |  | Options for the request. Set `options.method` to change the HTTP method. |

Query configs for mutations are slightly different. They have the following options:

| Name | Type | Required? | Description |
|:---|:---|:---:|:---|
| `url` | string | yes | The URL for the HTTP request. |
| `transform` | function |  | Function that transforms the response data to an entities object where keys are entity IDs and values are entity data. Can be used to normalize data. |
| `update` | object | yes | Object where keys are entity IDs and values are update functions. |
| `optimisticUpdate` | object |  | Object where keys are entity IDs and values are functions that provide the current entity value. The return values are used to update the `entities` store until the mutation finishes. |
| `body` | object |  | The HTTP request body. |
| `queryKey` | string |  | The identifier used to identify the query metadata in the `queries` reducer. If unprovided, the `url` and `body` fields are serialized to generate the query key. |
| `options` | object |  | Options for the request. Set `options.method` to change the HTTP method. |

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

### `connectRequest`

Use the `connectRequest` higher-order component to declare network dependencies for a React component. `connectRequest` takes a function that transforms the component `props` to a query config. Example usage:

```javascript
import { connectRequest, querySelectors } from 'redux-query';

class Dashboard extends Component {
    ...
}

const DashboardContainer = connectRequest((props) => ({
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
}))(Dashboard);

const mapStateToProps = (state, props) => {
    return {
        dashboard: getDashboard(state, props),
    };
};

export default connect(mapStateToProps)(DashboardContainer);
```

`connectRequest` passes an extra prop to the child component: `forceRequest`. Calling this function will cause the request to be made again. This may be useful for polling or creating an interface to trigger refreshes.

### `mutateAsync`

Dispatch `mutateAsync` Redux actions to trigger mutations. Example usage with a [react-redux](https://github.com/reactjs/react-redux)-connected component:

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

### `requestAsync`

Similarly to how mutations are triggered by dispatching `mutateAsync` actions, you can trigger requests by dispatching `requestAsync` actions.

## Example

A fork of the `redux` [Async](https://github.com/reactjs/redux/tree/master/examples/async) example is included. To run:

```sh
$ cd examples/async
$ npm install
$ npm run start
```
