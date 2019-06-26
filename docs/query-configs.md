---
id: query-configs
title: Query Configs
---

Query configs are the atomic unit of redux-query. They describe how a query should be translated into a network request and how the response should be handled. Most redux-query APIs use query configs as the primary parameter – they are used for most Redux actions and selectors. With redux-query-react, they're also used for all React integration APIs.

Query configs usually are defined to update at least one entity in the [entities](entities) state. But it's possible that they don't update any entities, or update more than one.

## Query keys

A query key is a unique identifier string generated for a given query config. You can set an explicit query key by providing a `queryKey` field in the query config, or you can rely on the default behavior where redux-query will serialize the `url` and `body` fields.

**Important**: redux-query and redux-query-react make assumptions about query configs and their query keys. Most logic will assume that query configs with equal query keys are themselves equal.

## Transform and update

With a successful query, there are two steps in which a response is handled before storing the result in the entities state: the "transform" step and the "update" step.

"Transform" is the first step. This typically involves normalizing the response data and transforming it to fit your entity schema. After the data has gone through the "transform" step, it gets passed to the "update" functions, where it is then reconciled with the previously-stored entity state.

See the examples below for how this looks in practice, and read the [transform functions](#transform-functions) and [update functions](#update-functions) sections below for more API details.

## Optimistic updates

Optimistic updates are handled similarly to updates, but they obviously don't have the new data, just the previous.

When optimistic updates fail, you can specify rollback behavior to undo that optimistic update. If you don't specify a rollback behaivor, redux-query will simply revert the entity state to the value that was saved before the optimistic update took place. This is only a concern if you are dealing with an entity that is a collection (like an array of map) that could be affected by multiple simultaneous mutations.

## Basic example

```javascript
// After making a request with this query config and receiving a successful
// response, the "echoedMessage" entity will be "hello"
const helloWorld = {
  url: '/api/echo',
  body: {
    message: 'hello',
  },
  transform: responseBody => {
    // The server responded with a JSON body: { "data": "hello" }
    return {
      echoedMessage: responseBody.data,
    };
  },
  update: {
    echoedMessage: (oldValue, newValue) => newValue,
  },
};
```

## Real-world example

```javascript
// Query config for retrieving current user's playlists
const playlists = () => ({
  url: '/api/playlists',
  transform: responseBody => {
    const { data } = responseBody;

    // Server returned key-value pair of playlists by id
    const { playlists } = data;
    const playlistIds = playlists.map(playlist => playlist.id);

    return {
      playlistIds,
      playlistsById: playlists,
    };
  },
  update: {
    playlistIds: (oldValue, newValue) => {
      // We fetched all the playlists, so can disregard previous value
      return newValue;
    },
    playlistsById: (oldValue, newValue) => {
      return {
        ...oldValue,
        ...newValue,
      };
    },
  },
});

// Query config for making a new playlist
const makePlaylist = name => ({
  url: '/api/make-playlist',
  body: {
    name,
  },
  transform: responseBody => {
    const { data } = responseBody;

    // Server returned a single playlist model object
    // Transform this data before reconciling with previous-stored entity data
    const { playlist } = data;
    const playlistIds = [playlist.id];

    return {
      playlistIds,
      playlistsById: {
        [playlist.id]: playlist,
      },
    };
  },
  update: {
    playlistIds: (oldValue, newValue) => {
      // Assume new playlists get added to the end of the list
      return [...oldValue, newValue];
    },
    playlistsById: (oldValue, newValue) => ({
      ...oldValue,
      ...newValue,
    }),
  },
});
```

## API

### Request query config fields

| Name        | Type     | Required? | Description                                                                                                                                                       |
| :---------- | :------- | :-------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`       | string   |    yes    | The URL for the HTTP request.                                                                                                                                     |
| `transform` | function |           | A function that transforms the response data to an entities object where keys are entity IDs and values are entity data. Can be used to normalize data.           |
| `update`    | object   |           | An object where keys are entity IDs and values are "update functions" (see below).                                                                                |
| `body`      | object   |           | The request body. For GETs, this object is stringified and appended to the URL as query params.[^1]                                                               |
| `force`     | boolean  |           | A flag to indicate that the request should be performed even if a previous query with the same query key succeeded.                                               |
| `queryKey`  | string   |           | The identifier used to identify the query metadata in the `queries` reducer. If unprovided, the `url` and `body` fields are serialized to generate the query key. |
| `meta`      | object   |           | Various metadata for the query. Can be used to update other reducers when queries succeed or fail.                                                                |
| `options`   | object   |           | Options for the request. Set `options.method` to change the HTTP method, `options.headers` to set any headers and `options.credentials = 'include'` for CORS.     |

### Mutation query config fields

| Name               | Type     | Required? | Description                                                                                                                                                                                                                                                                   |
| :----------------- | :------- | :-------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`              | string   |    yes    | The URL for the HTTP request.                                                                                                                                                                                                                                                 |
| `transform`        | function |           | A function that transforms the response data to an entities object where keys are entity IDs and values are entity data. Can be used to normalize data.                                                                                                                       |
| `update`           | object   |           | An object where keys are entity IDs and values are "update functions" (see below).                                                                                                                                                                                            |
| `optimisticUpdate` | object   |           | An object where keys are entity IDs and values are "optimisticUpdate functions" (see below). Used to update entities immediately when the mutation starts.                                                                                                                    |
| `rollback`         | object   |           | An object where keys are entity IDs and values are "rollback functions" (see below). Used to reverse the effects of `optimisticUpdate` when the mutation fails. If not provided, the entity will simply be reverted to its value before the `optimisticUpdate` was performed. |
| `body`             | object   |           | The HTTP request body. For GETs, this object is stringified and appended to the URL as query params.[^1]                                                                                                                                                                      |
| `queryKey`         | string   |           | The identifier used to identify the query metadata in the `queries` reducer. If unprovided, the `url` and `body` fields are serialized to generate the query key.                                                                                                             |
| `meta`             | object   |           | Various metadata for the query. Can be used to update other reducers when queries succeed or fail.                                                                                                                                                                            |
| `options`          | object   |           | Options for the request. Set `options.method` to change the HTTP method, `options.headers` to set any headers and `options.credentials = 'include'` for CORS.                                                                                                                 |

### transform functions

`transform` functions let you process and normalize response data before it is passed to the `update` step. They have the following signature:

```javascript
(responseJson: ?Object, responseText: ?string) => { [key: string]: any }
```

If your data is normalized on the server, you may not need to use this function.

### update functions

`update` functions are responsible for reconciling response data with the existing entity state for the given entity ID. They have the following signature:

```javascript
(prevValue: any, transformedValue: any) => any;
```

The `prevValue` is the whatever value is selected from the `entities` reducer for the respective entity ID. The returned value from this function will become the new value for the entity ID in the `entities` reducer.

### optimisticUpdate functions

`optimisticUpdate` functions are just like update functions except they only pass the `prevValue`:

```javascript
(prevValue: any) => any;
```

### rollback functions

`rollback` functions are used to reverse the effect of `optimisticUpdate`s when the mutation fails. They are provided two parameters: the state of the entity before the optimistic update and the current state of the entity:

```javascript
(initialValue: any, currentValue: any) => any;
```

Specifying `rollback` functions are not required. However, it is recommended for entities that are partially updated (e.g. an object collection of items keyed by IDs). The default `rollback` behavior is equivalent to the following:

```javascript
(initialValue, currentValue) => initialValue;
```

[^1]: This behavior is only guaranteed when using the superagent network interface, which is the network interface used if you use the default middleware.
