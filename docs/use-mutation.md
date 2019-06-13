---
id: use-mutation
title: useMutation
---

`useMutation` is a React hook provided by redux-query-react that can be used for easily making mutations from a React component.

## API

Like `useRequest`, `useMutation` returns a tuple-like array, where the first value in the tuple is an object representing the [query state](query-state) for the mutation. The second value in the tuple is a callback to actually trigger the mutation. Unlike `useRequest`, the mutation action is not dispatched automatically when the associated component mounts – the returned callback must be called. Also, mutations are never cancelled by `useMutation`.

## Example

```javascript
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useMutation } from 'redux-query-react';

const clearNotificationsMutation = {
  url: '/api/clear-notifications',
  update: {
    notifications: (oldValue, newValue) => newValue,
  },
};

const ClearNotificationsButton = () => {
  const [{ isPending }, clearNotifications] = useMutation(clearNotificationsMutation);

  return (
    <div>
      <button onClick={clearNotifications} disabled={isPending}>
        {isPending ? 'Clearing…' : 'Clear'}
      </button>
    </div>
  );
};
```
