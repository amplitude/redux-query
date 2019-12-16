---
id: use-requests
title: useRequestss
---

`useRequests` is one of the React hooks provided by redux-query-react. It's intended to be used for cases when you have a component that has network dependencies (i.e. things need to load from the server in order for this component to render properly). Its behavior is as follows:

1. When the associated component first renders, if there is a valid array of query configs provided, then requests will be made (by dispatching a [`requestAsync`](redux-actions#requestasync) action).
2. Whenever the query configs change and its query keys also change as a result, then new requests will be made. Also, if there are previously-issued requests that is still in-flight, then a [`cancelQuery`](redux-actions#cancelquery) action will be dispatched which will attempt to abort the active network requests.
3. When the associated component unmounts and there are requests in-flight, then [`cancelQuery`](redux-actions#cancelquery) actions will be dispatched which will attempt to abort the active network requests.

## API

`useRequests` takes a single parameter – an array of query configs. If you pass null, undefined, or an invalid array of query configs as the parameter to `useRequests`, the values will be ignored.

`useRequests` returns a tuple-like array, where the first value in the tuple is an object representing the state of the requests. This object will have "isFinished" and "isPending" keys. "isFinished" will be false until all queries in the query array are cmopleted. "isPending" will be true as long as any of the queries are still in flight. The second value in the tuple is a callback to re-issue all the requests, even if previous requests with the same query key have already been made and resulted in a successful server responses.

## Example

```javascript
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useRequests } from 'redux-query-react';

const getNotifications = state => state.entities.notifications;

const getUsers = state => state.entities.users;

const requests = [
  {
    url: '/api/notifications',
    update: {
      notifications: (oldValue, newValue) => newValue,
    },
  },
  {
    url: '/api/users',
    update: {
      users: (oldValue, newValue) => newValue,
    },
  },
];

const NotificationsView = () => {
  const notifications = useSelector(getNotifications) || [];
  const users = useSelector(getUsers) || [];

  const [{ isPending, isFinished }, refresh] = useRequests(requests);

  if (isPending) {
    return 'Loading…';
  }

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      <ul>
        {notifications.map(notification => (
          <Notification key={notificationId} />
        ))}
      </ul>
      <ul>
        {users.map(user => (
          <User key={userId} />
        ))}
      </ul>
    </div>
  );
};
```
