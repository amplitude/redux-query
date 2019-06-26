---
id: redux-selectors
title: Selectors
---

## Query selectors

redux-query provides the following selectors, available from the `querySelectors` for reading from the queries reducer state:

| Selector Name | Return Type | Description                                                  |
| :------------ | :---------- | :----------------------------------------------------------- |
| isFinished    | boolean     | Returns `true` if the query was resolved or cancelled.       |
| isPending     | boolean     | Returns `true` if the query is in-flight.                    |
| status        | ?number     | Response HTTP status code.                                   |
| lastUpdated   | ?number     | Time at which the query was resolved.                        |
| queryCount    | number      | Number of times a query was started with the same query key. |

All of the query selectors have the same signature: the root queries reducer state object as the first parameter and the query config as the second parameter.

## Error selectors

If you have the [`errorsReducer`](error-state) as part of your Redux state, then you can query from the errors state using the provided `errorSelectors`:

| Selector Name   | Return Type             | Description                                      |
| :-------------- | :---------------------- | :----------------------------------------------- |
| responseBody    | ?any                    | Parsed response body (if query failed).          |
| responseText    | ?string                 | Unparsed response body string (if query failed). |
| responseHeaders | ?{ [key: string]: any } | Response headers (if query failed).              |

All of the query selectors have the following signature: the root errors reducer state as the first paramater and the query config as the second parameter.
