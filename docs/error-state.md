---
id: error-state
title: Error State
---

redux-query provides another reducer for applications that want to store the response body, text, and headers in Redux state for all queries that failed. Unlike the entities and queries reducers, `errorsReducer` is totally optional. If you include this reducer in your application's combined reducer, all responses from requests and mutations with non-2xx status codes will be recorded in this state.

**Note**: If your application has many queries that could potentially error and is used for long periods of time, you should avoid using this reducer as it could potentially accumulate a lot of memory usage. You can alternatively build your own reducer to track a subset of queries, or rely on the promise interface to handle error responses in an ad-hoc manor.

You can query from this state using the provided [`errorSelectors`](redux-selectors#error-selectors).
