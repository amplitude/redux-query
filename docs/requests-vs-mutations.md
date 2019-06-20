---
id: requests-vs-mutations
title: Requests vs. Mutations
---

Inspired by GraphQL, redux-query supports two types of queries:

- **requests**: Idempotent queries that read network data without side-effects. Default HTTP method: GET.
- **mutations**: Possibly destructive queries that mutate network data (i.e. the "C", "U", and "D" in "CRUD"). Default HTPT method: POST.

## How to make requests

Dispatch a [requestAsync](redux-actions#requestasync) action with your Redux store.

If you'd like to make a request right from a React component, install redux-query-react and use either the [useRequest](#) hooks or the [connectRequest](#) HOC.

## How to make mutations

Dispatch a [mutateAsync](redux-actions#mutateasync) action with your Redux store.

If you'd like to fire a mutation right from a React component, install redux-query-react and use either the [useMutation](#) hook.
