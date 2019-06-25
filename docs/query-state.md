---
id: query-state
title: Query State
---

In addition to managing [entities](entities) state, redux-query tracks metadata state around the query itself.

Query state is stored in your Redux store and is handled by the `queriesReducer` provided by redux-query. Each query is identified by its [query key](query-configs#query-keys), and the query state stores the metadata in an object map based on that query key.

Here's an example of query state. This query state indicates that we've only made two queries – one request to "/api/playlists" that is currently in-flight, and a mutation to "/api/make-playlist" that was successful.

```json
{
  "{\"url\":\"/api/playlists\"}": {
    "isFinished": false,
    "isMutation": false,
    "isPending": true,
    "queryCount": 1
  },
  "{\"url\":\"/api/make-playlist\"}": {
    "headers": {
      "server-timing": "thdr;dur=112"
    },
    "lastUpdated": 1561055454841,
    "isFinished": true,
    "isMutation": true,
    "isPending": false,
    "queryCount": 1,
    "status": 200
  }
}
```

**Note**: Due to memory concerns, redux-query does not store the raw response data in query state. Instead, that data should be transformed and stored in [entitites](entities).

To learn how to use the query state in your logic or UI, see [redux selectors](redux-selectors). Writing your own selectors to extract metadata from the queries state is discouraged.
