---
id: typescript
title: Typescript Support
---

Even though redux-query, redux-query-react, and redux-query-interface-superagent are all written using Flow typings, they come with a full [Typescript](https://www.typescriptlang.org/) support. Typescript support is automatic, so typings should be available to you as soon as you install these packages.

## Importing types

You can import redux-query's Typescript types into your project like this:

```typescript
import { QueryConfig } from 'redux-query';
```

## Disabling typescript

Add these lines to the `exclude` section in your .flowconfig (ignore any libraries that you aren't using):

```json
"exclude": [
  "node_modules/redux-query/*.d.ts"
  "node_modules/redux-query-react/*.d.ts"
  "node_modules/redux-query-interface-superagent/*.d.ts"
]
```
