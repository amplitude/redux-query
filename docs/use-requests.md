---
id: use-requests
title: useRequests
---

`useRequests` is one of the React hooks provided by redux-query-react. It's intended to be used for cases when you have a component that has network dependencies (i.e. things need to load from the server in order for this component to render properly). Its behavior is as follows:

1. When the associated component first renders, if there is a valid array of query configs provided, then requests will be made (by dispatching a [`requestAsync`](redux-actions#requestasync) action).
2. Whenever the query configs change and its query keys also change as a result, then new requests will be made. Also, if there are previously-issued requests that is still in-flight, then a [`cancelQuery`](redux-actions#cancelquery) action will be dispatched which will attempt to abort the active network requests.
3. When the associated component unmounts and there are requests in-flight, then [`cancelQuery`](redux-actions#cancelquery) actions will be dispatched which will attempt to abort the active network requests.

## API

`useRequests` takes a single parameter – an array of query configs. If you pass null, undefined, or an invalid array of query configs as the parameter to `useRequests`, the values will be ignored.

`useRequests` returns a tuple-like array, where the first value in the tuple is an object representing the state of the requests. This object will have "isFinished" and "isPending" keys. "isFinished" will be false until all queries in the query array are cmopleted. "isPending" will be true as long as any of the queries are still in flight. The second value in the tuple is a callback to re-issue all the requests, even if previous requests with the same query key have already been made and resulted in a successful server responses.

## Note

`useRequests` is meant to for cases in which the number of querys that are going to be dispatched is unknown or arbitrary. The point of this hook is for when a batch of queries need to be called and state of the individual queries is not important. What is important for the use case of this hook is the overall state of all of the input queries.

The below example takes an array of user requests. The list of users will not be rendered until every request in array of requests is complete.

## Example

```javascript
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useRequests } from 'redux-query-react';

const getUsers = state => state.entities.users;

const userIds = ['ryan.busk@amplitude.com', 'ryan@amplitude.com' /* etc... */]; // arbitrary number of users

const requests = userIds.map(userId => {
  return {
    url: `/api/users/${userId}`,
    update: {
      users: (oldValue, newValue) => {
        return (oldValue[user] = newValue);
      },
    },
  };
}); // unknown number of requests

const NotificationsView = () => {
  const users = useSelector(getUsers) || [];

  const [{ isPending, isFinished }, refresh] = useRequests(requests);

  if (!isFinished) {
    return 'Loading…';
  }

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      <ul>
        {users.map(user => (
          <User key={user.userId} />
        ))}
      </ul>
    </div>
  );
};
```
