# redux-query

[![npm](https://img.shields.io/npm/v/redux-query.svg?style=flat-square)](https://www.npmjs.com/package/redux-query)
[![Travis](https://img.shields.io/travis/amplitude/redux-query.svg?style=flat-square)](https://travis-ci.org/amplitude/redux-query)
[![Codecov](https://img.shields.io/codecov/c/github/amplitude/redux-query.svg?style=flat-square)](https://codecov.io/gh/amplitude/redux-query)

redux-query is a set of libraries for managing network state in Redux applications. This package is the main library.

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

## API

- [Redux Actions](https://amplitude.github.io/redux-query/docs/redux-actions)
- [Redux Selectors](https://amplitude.github.io/redux-query/docs/redux-selectors)

## Examples

- [Simple example](https://amplitude.github.io/redux-query/examples/simple): This example is a very simple web app that has only one feature – you can view and update your username. The purpose of this example is to demonstrate how requests and mutations (including optimistic updates) work with redux-query.
- [Hacker News](https://amplitude.github.io/redux-query/examples/hacker-news): This example shows how to use redux-query, redux-query-react, and redux-query-interface-superagent to build a basic Hacker News client. You can run this example in the browser by clicking the button below:

## About

Brought to you by [Amplitude](https://amplitude.com/engineering). We're hiring!
