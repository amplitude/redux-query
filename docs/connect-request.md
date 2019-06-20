---
id: connect-request
title: connectRequest
---

`connectRequest` is a [higher-order component](https://reactjs.org/docs/higher-order-components.html) provided by redux-query-react. It's intended to be used for cases when you have a component that has network dependencies (i.e. things need to load from the server in order for this component to render properly). Its behavior is as follows:

1. When the React component mounts, all of the provided query configs will trigger a corresponding request (by dispatching a [`requestAsync`](redux-actions#requestasync) action). Invalid query configs and null values are ignored.
2. Whenever the provided query configs change, the previous list of query configs is diffed against the new list. Query configs are considered to be equal if they have the same query key. Based on this diff, any new query configs will result in new request actions. Any query configs from the previous query config list that don't exist in the new list may be cancelled if the request is still in-flight. This is handled by dispatching a [`cancelQuery`](redux-actions#cancelquery) action.
3. When the associated component unmounts, any in-flight requests will be cancelled.

## API

`connectRequest` takes a function that maps React props to query configs. You can call this function `mapPropsToConfigs`.

`mapPropsToConfigs` can return null, a single query config, or a list of query configs. Nulls and invalid query configs are ignored.

## Example

```javascript
import { compose } from 'redux';
import { connect } from 'react-redux';
import { querySelectors } from 'redux-query';
import { connectRequest } from 'redux-query-react';

const getQueries = state => state.queries;

const getNotification = (state, notificationId) => {
  return (state.entities.notificationsById || {})[notificationId];
};

class NotificationView extends Component {
  // ...
}

const mapStateToProps = (state, props) => ({
  isLoading: mapPropsToConfigs(props).some(queryConfig =>
    querySelectors.isPending(getQueries, queryConfig),
  ),
  notification: getNotification(state, props.notificationId),
});

const mapPropsToConfigs = props => [
  {
    url: `/api/notification/${props.notificationId}`,
    transform: responseBody => {
      const { notification } = responseBody.data;

      return {
        notificationsById: {
          [notification.id]: notification,
        },
      };
    },
    update: {
      notificationsById: (prevValue, newValue) => ({
        ...prevCharts,
        ...newValue,
      }),
    },
  },
];

const NotificationViewContainer = compose(
  connect(mapStateToProps),
  connectRequest(mapPropsToConfigs),
)(NotificationView);
```

### forceRequest

`connectRequest` passes an extra prop to the child component: `forceRequest`. Calling this function will cause the request(s) to be made again. This may be useful for polling or creating an interface to trigger refreshes.
