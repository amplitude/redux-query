---
id: requests-vs-mutations
title: Requests vs. Mutations
---

Inspired by GraphQL, redux-query supports two types of queries:

- **requests**: Idempotent queries that read network data without side-effects. Default HTTP method: GET.
- **mutations**: Possibly destructive queries that mutate network data (i.e. the "C", "U", and "D" in "CRUD"). Default HTTP method: POST.

## Key difference – avoiding unnecessary requests

If the same request (two queries are assumed to be the same if they have the same [query key](query-configs#query-keys)) has already been made and resulted in a successful server response, then the new request be ignored. It is possible to force a request to trigger a network request using the [`force`](query-configs#request-query-config-fields) flag.

Mutations always trigger a network request.

## How to make requests

Dispatch a [requestAsync](redux-actions#requestasync) action with your Redux store.

If you'd like to make a request right from a React component, install redux-query-react and use either the [useRequest](use-request) and [`useRequests`](use-requests) hooks or the [connectRequest](connect-request) HOC.

## How to make mutations

Dispatch a [mutateAsync](redux-actions#mutateasync) action with your Redux store.

If you'd like to fire a mutation right from a React component, install redux-query-react and use the [useMutation](use-mutation) hook.
