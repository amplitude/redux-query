---
id: flow
title: Flow Support
---

redux-query, redux-query-react, and redux-query-interface-suepragent all come with built-in [Flow](https://flow.org/) types. You should be able to take advantage of these types without any change to your flow configuration. These types have no effect if you are not using Flow.

## Importing types

You can import redux-query's Flow types into your project like so:

```javascript
import type { QueryConfig } from 'redux-query/src/types';
```

## Disabling flow

Add these lines to the `[ignore]` section in your .flowconfig (ignore any libraries that you aren't using):

```
.*/node_modules/redux-query/dist/.*.js.flow
.*/node_modules/redux-query-react/dist/.*.js.flow
.*/node_modules/redux-query-interface-superagent/dist/.*.js.flow
```
