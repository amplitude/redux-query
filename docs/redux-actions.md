---
id: redux-actions
title: Actions
---

## mutateAsync

Dispatch a mutateAsync action to trigger a [mutation](requests-vs-mutations). mutateAsync accepts a [mutation query config](query-configs#mutation-query-config-fields) as a single required parameter. Dispatching a mutateAsync action will always trigger a network request.

When dispatching a `mutateAsync` action, you can Promise-chain on the returned value from `dispatch`. Here's an example inside a [react-redux container](https://react-redux.js.org/using-react-redux/connect-mapdispatch):

```javascript
import { mutateAsync } from 'redux-query';
import { updateDashboard } from '../queries/dashboard';

export const updateDashboard = (dashboardId, newName) => {
  return mutateAsync(updateDashboard(dashboardId, newName));
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    changeName: newName => {
      dispatch(updateDashboard(props.dashboardId, newName)).then(result => {
        if (result.status !== 200) {
          dispatch(showUpdateDashboardFailedNotification(props.dashboardId));
        }
      });
    },
  };
};
```

The result of the promise returned by `mutateAsync` will be the following object:

| Name     | Type           | Description                                                                    |
| :------- | :------------- | :----------------------------------------------------------------------------- |
| status   | number         | HTTP status code.                                                              |
| body     | object or null | Parsed response body.                                                          |
| text     | string         | Unparsed response body string.                                                 |
| duration | number         | The total duration from the start of the query to receiving the full response. |

When the mutation succeeds, it will also include the following fields:

| Name        | Type   | Description                                                                                                   |
| :---------- | :----- | :------------------------------------------------------------------------------------------------------------ |
| transformed | any    | Result from the transform function. Will be identical to body if transform is unprovided in the query config. |
| entities    | object | The new, updated entities that have been affected by the query.                                               |

## requestAsync

Similarly to how mutations are triggered by dispatching `mutateAsync` actions, you can trigger requests by dispatching `requestAsync` actions with a request query config.

You can also Promise-chain on dispatched `requestAsync` actions, but a Promise will only be returned if `redux-query` determines it will make a network request. For example, if the query config does not have `force` set to `true` and a previous request with the same query key previously succeeded, then a Promise will not be returned. So be sure to always check that the returned value from a dispatched `requestAsync` is a Promise before interacting with it.

**Note**: With redux-query-react, [`connectRequest`](connect-request), [`useRequest`](use-request), and [`useRequests`](use-requests) automatically dispatch `requestAsync` actions when the associated component mounts (if the provided query config is valid). It will also dispatch `requestAsync` actions whenever the query config updates with a new query key.

## cancelQuery

To cancel an in-flight query, dispatch a `cancelQuery` action with the [query key](query-configs#query-keys) as the only parameter. If there is a query in-flight with that query key, redux-query will attempt to cancel that query (by calling `abort` on the [network interface](network-interfaces)).

**Important**: It is not recommended to cancel mutations. As mutations are potentially "destructive", in that they may change persistent server data, cancelling a mutation query may not actually halt the destructive action from taking place.

```javascript
import { cancelQuery } from 'redux-query';

store.dispatch(cancelQuery('{"url":"/api/playlists"}'));
```

**Note**: With redux-query-react, [`connectRequest`](connect-request), [`useRequest`](use-request), and [`useRequests`](use-requests) automatically dispatch `cancelQuery` actions when the associated component unmounts.

## updateEntities

You can manually update [entities](entities) within the `entitiesReducer` Redux state with this action. The only required parameter is an object map just like the `optimisticUpdate` field in [query configs](query-configs#request-query-config-fields).

```javascript
import { updateEntities } from 'redux-query';

store.dispatch(
  updateEntities({
    email: prevValue => 'ryan@amplitude.com',
  }),
);
```
