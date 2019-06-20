---
id: network-interfaces
title: Network Interfaces
---

Network interfaces exist at the transport layer of abstraction. You can write your own network interface or you can use the recommended one that redux-query provides: redux-query-interface-superagent, which performs cancellable XHR requests using the [superagent](https://github.com/visionmedia/superagent) library.

## Writing your own network interface

Network interfaces have the following interface:

```javascript
type NetworkInterface = (
  url: string,
  method: 'DELETE' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH',
  networkOptions: {
    body: ?any,
    headers: ?{ [key: string]: any },
    credentials: ?('include' | 'same-origin' | 'omit'),
  },
) => NetworkHandler;
```

Network interfaces must return an object, called a "network handler", that has two functions: `execute` and `abort`. Execute takes a callback that should be called when the query response has been received. Network interfaces should build mechanisms to cancel queries and avoid calling the `execute` callback if a query has been cancelled.

```javascript
type NetworkHandler = {|
  abort: () => void,
  execute: (
    callback: (
      error: any,
      status: number,
      responseBody: ?any,
      responseText: ?string,
      responseHeaders: ?{ [key: string]: any },
    ) => void,
  ) => void,
|};
```

Network interfaces are a required parameter when configuring your redux store redux-query middleware:

```javascript
const store = createStore(
  reducer,
  applyMiddleware(queryMiddlewareAdvanced(myNetworkInterface, getQueries, getEntities)),
);
```
