---
id: v2-to-v3
title: 3.x Upgrade Guide
---

## Key changes

### Separate packages

redux-query 2.x was a single package that had React as a peer dependency and superagent as a direct dependency. With 3.x, redux-query has been split into separate packages: redux-query, redux-query-react, and redux-query-interface-superagent. This enables Redux-powered apps that don't use React to more-easily use redux-query. It also enables apps to not have to depend on superagent if they wish to use a different network interface.

### Explicit network interfaces

redux-query 2.x supported the ability to define a custom network interfaces, but it was not required. If you did not use the "advanced" query middleware, then redux-query would use the default superagent-based network interface. With 3.x, you must explicitly provide the network interface, even if it is redux-query-interface-superagent.

### New React hooks: useRequest and useMutation

redux-query-react 3.x provides new [React hooks](https://reactjs.org/docs/hooks-intro.html) to make it easier to make requests and mutations right from your React component. Compared to connectRequest, these hooks require less code to write and come with the convenience of automatically providing the query state.

With this change, there is a new setup step required to get started. redux-query-react provides a `Provider` component that requires a single prop – a selector to get the query reducer state.

### Support for react-redux 7.1.0 or later and new React Context API

redux-query 2.x used the legacy React Context API for accessing the Redux store. redux-query-react 3.x adds support for react-redux 7.1.0 or later, which uses the new [React Context](https://reactjs.org/docs/context.html) API internally.

### Flow types

If your app uses flow, you will now benefit from built-in flow types.

### Smaller changes

- The `update` query config field is no longer required.
- The network handler instance is no longer stored in the query reducer state.
- The queries reducer state no longer stores the query url.
- connectRequest has been rewritten to use hooks internally.
- connectRequest's `withRef` option has been renamed to `forwardRef`.

## Action items

If your app uses the default network interface (i.e. you do not use the "advanced" middleware):

1. Add redux-query-interface-superagent as a dependency.
2. Update where you initialize the query middleware so that you pass the network interface as the first parameter to the middleware. See the [getting started](../getting-started#configure-redux) section for configuring Redux for how that should look.

If your app does not use the default network interface (i.e. you use the "advanced" middleware):

1. Update all `redux-query/advanced` imports to just `redux-query`.
2. Update where you initialize the query middleware so that you pass the network interface as the first parameter to the middleware. See the [getting started](../getting-started#configure-redux) section for configuring Redux for how that should look.

If your app uses connectRequest:

1. Update react-redux to 7.1.0 or later.
2. Add redux-query-react as a dependency.
3. Follow the [getting started](getting-started#setup-react-integration) section for setting up the React integration.
4. If any of your existing connectRequest calls use the `withRef` configuration option, rename that to `forwardRef`.
5. Going forwards, consider using [useRequest](../use-request), [useRequests](../use-requests), and [useMutation]('../use-mutation) instead of connectRequest for new components.

And finally:

1. Update any code that referenced the `url` or `networkHandler` fields in the query reducer state.
2. As there are a lot of internal changes with this release, it is strongly recommended to test your app for any regressions.
