# redux-query-react

[![npm](https://img.shields.io/npm/v/redux-query-react.svg?style=flat-square)](https://www.npmjs.com/package/redux-query-react)

redux-query-react is a library for directly integrating [redux-query](https://amplitude.github.io/redux-query/) features with your React components.

## Why use redux-query?

- **It's simply Redux**: Follow best practices for storing and handling network state in Redux, with support for features like optimistic updates and cancellation. There's no magic here, just middleware, actions, selectors, and reducers.
- **It's extensible**: Built to fit most use cases out-of-the-box, but can easily be extended with custom Redux middleware, UI integrations, and network interfaces.
- **It works great with React**: With the provided React hooks and higher-order component in redux-query-react (optional), colocate data dependencies with your components and run requests when components mount or update.

## Docs

- **[Getting Started and Installation](https://amplitude.github.io/redux-query/docs/getting-started)**

## API

- [useRequest](https://amplitude.github.io/redux-query/docs/use-request)
- [useMutation](https://amplitude.github.io/redux-query/docs/use-mutation)
- [connectRequest](https://amplitude.github.io/redux-query/docs/connect-request)

## Examples

- [Simple example](https://amplitude.github.io/redux-query/docs/examples/simple): This example is a very simple web app that has only one feature – you can view and update your username. The purpose of this example is to demonstrate how requests and mutations (including optimistic updates) work with redux-query.
- [Hacker News](https://amplitude.github.io/redux-query/docs/examples/hacker-news): This example shows how to use redux-query, redux-query-react, and redux-query-interface-superagent to build a basic Hacker News client.

## License

[MIT](https://github.com/amplitude/redux-query/blob/master/LICENSE)

## About

Brought to you by [Amplitude Engineering](https://amplitude.com/engineering). We're hiring!
