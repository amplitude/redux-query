---
id: use-request
title: useRequest
---

`useRequest` is one of the hooks provided by redux-query-react. It's intended to be used for cases when you have a component that has network dependencies (i.e. things need to load from the server in order for this component to render properly). Its behavior is as follows:

1. When the associated component first renders, if there is a valid query config provided, then a request will be made (by dispatching a [`requestAsync`](redux-actions#requestasync) action).
2. Whenever the query config changes and its query key also changes as a result, then a new request will be made. Also, if there is a previously-issued request that is still in-flight, then a [`cancelQuery`](redux-actions#cancelquery) action will be dispatched which will attempt to abort the network request.
3. When the associated component unmounts and there is a request in-flight, then a [`cancelQuery`](redux-actions#cancelquery) action will be dispatched which will attempt to abort the network request.

## API

`useRequest` returns a tuple-like array, where the first value in the tuple is an object representing the [query state](query-state) for the request. The second value in the tuple is a callback to re-issue the request, even if a previous request with the same query key has already been made and resulted in a successful server response.

## Example

```javascript
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useRequest } from 'redux-query-react';

const getNotifications = state => state.entities.notifications;

const notificationsRequest = {
  url: '/api/notifications',
  update: {
    notifications: (oldValue, newValue) => newValue,
  },
};

const NotificationsView = () => {
  const notifications = useSelector(getNotifications) || [];

  const [{ isPending, status }, refresh] = useRequest(notificationsRequest);

  if (isPending) {
    return 'Loading…';
  }

  if (typeof status === 'number' && status >= 400) {
    return 'Sorry! Something went wrong. Please try again.';
  }

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      <ul>
        {notifications.map(notification => (
          <Notification key={notificationId} />
        ))}
      </ul>
    </div>
  );
};
```
