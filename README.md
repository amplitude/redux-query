# redux-query

[![Travis](https://img.shields.io/travis/amplitude/redux-query.svg?style=flat-square)](https://travis-ci.org/amplitude/redux-query)
[![Codecov](https://img.shields.io/codecov/c/github/amplitude/redux-query.svg?style=flat-square)](https://codecov.io/gh/amplitude/redux-query)

A library for managing network state in Redux.

## Why use redux-query?

- **It's simply Redux**: Follow best practices for storing and handling network state in Redux, with support for features like optimistic updates and cancellation. There's no magic here, just middleware, actions, selectors, and reducers.
- **It's extensible**: Built to fit most use cases out-of-the-box, but can easily be extended with custom Redux middleware, UI integrations, and network interfaces.
- **It works great with React**: With the provided React hooks and higher-order component in redux-query-react (optional), colocate data dependencies with your components and run requests when components mount or update.

## Docs

- **[Getting Started and Installation](https://amplitude.github.io/redux-query/docs/getting-started)**
- [Entities](https://amplitude.github.io/redux-query/docs/entities)
- [Requests vs. Mutations](https://amplitude.github.io/redux-query/docs/requests-vs-mutations)
- [Query Configs](https://amplitude.github.io/redux-query/docs/query-configs)
- [Query State](https://amplitude.github.io/redux-query/docs/query-state)
- [Error State](https://amplitude.github.io/redux-query/docs/error-state)
- [Network Interfaces](https://amplitude.github.io/redux-query/docs/network-interfaces)
- [Flow Support](https://amplitude.github.io/redux-query/docs/flow)
- [Typescript Support](https://amplitude.github.io/redux-query/docs/typescript)

## Redux API

- [Redux Actions](https://amplitude.github.io/redux-query/docs/redux-actions)
- [Redux Selectors](https://amplitude.github.io/redux-query/docs/redux-selectors)

## React API

- [useRequest](https://amplitude.github.io/redux-query/docs/use-request)
- [useRequests](https://amplitude.github.io/redux-query/docs/use-requests)
- [useMutation](https://amplitude.github.io/redux-query/docs/use-mutation)
- [connectRequest](https://amplitude.github.io/redux-query/docs/connect-request)

## Examples

- [Simple example](https://amplitude.github.io/redux-query/docs/examples/simple): This example is a very simple web app that has only one feature – you can view and update your username. The purpose of this example is to demonstrate how requests and mutations (including optimistic updates) work with redux-query.
- [Hacker News](https://amplitude.github.io/redux-query/docs/examples/hacker-news): This example shows how to use redux-query, redux-query-react, and redux-query-interface-superagent to build a basic Hacker News client.

## Packages

This project is published as multiple packages. redux-query, the core library, is the only required package. redux-query-react is recommended if you are using React in your application. redux-query requires a [network interface](https://amplitude.github.io/redux-query/docs/network-interfaces) which handles the implementation of network requests. You must either use the recommended interface, redux-query-interface-superagent, or supply your own.

| Name                                                                              | Version                                                                                                                                                       | Description                                                        |
| :-------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------- |
| [`redux-query`](./packages/redux-query)                                           | [![npm](https://img.shields.io/npm/v/redux-query.svg?style=flat-square)](https://www.npmjs.com/package/redux-query)                                           | The core library for managing network requests with Redux.         |
| [`redux-query-react`](./packages/redux-query-react)                               | [![npm](https://img.shields.io/npm/v/redux-query-react.svg?style=flat-square)](https://www.npmjs.com/package/redux-query-react)                               | Library of APIs for integrating redux-query with React components. |
| [`redux-query-interface-superagent`](./packages/redux-query-interface-superagent) | [![npm](https://img.shields.io/npm/v/redux-query-interface-superagent.svg?style=flat-square)](https://www.npmjs.com/package/redux-query-interface-superagent) | The recommended network interface that handles network requests.   |

## Upgrade guides

- [1.x to 2.x](https://amplitude.github.io/redux-query/docs/upgrade-guides/v1-to-v2)
- [2.x to 3.x](https://amplitude.github.io/redux-query/docs/upgrade-guides/v2-to-v3)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](https://github.com/amplitude/redux-query/blob/master/LICENSE)

## About

Brought to you by [Amplitude Engineering](https://amplitude.com/engineering). We're hiring!
