# redux-query

[![Travis](https://img.shields.io/travis/amplitude/redux-query.svg?style=flat-square)](https://travis-ci.org/amplitude/redux-query)
[![Codecov](https://img.shields.io/codecov/c/github/amplitude/redux-query.svg?style=flat-square)](https://codecov.io/gh/amplitude/redux-query)

redux-query is a library for managing network state in Redux applications.

## Why use redux-query?

- **It's simply Redux**: Follow best practices for storing and handling network state in Redux, with support for features like optimistic updates and cancellation. There's no magic here, just middleware, actions, selectors, and reducers.
- **It's extensible**: Built to fit most use cases out-of-the-box, but can easily be extended with custom Redux middleware, UI integrations, and network interfaces.
- **It works great with React**: With the provided React hooks and higher-order component in redux-query-react (optional), colocate data dependencies with your components and run requests when components mount or update.

## Docs

[https://amplitude.github.io/redux-query](View the docs here).

[https://amplitude.github.io/redux-query/getting-started](Getting started).

## Examples

[https://amplitude.github.io/redux-query/examples/simple](Simple example): This example is a very simple web app that has only one feature – you can view and update your username. The purpose of this example is to demonstrate how requests and mutations (including optimistic updates) work with redux-query.

[https://amplitude.github.io/redux-query/examples/hacker-news](Hacker News): This example shows how to use redux-query, redux-query-react, and redux-query-interface-superagent to build a basic Hacker News client. You can run this example in the browser by clicking the button below:

## Packages

| Name                               | Version                                                                                                                                                       | Description                                                             |
| :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------- |
| `redux-query`                      | [![npm](https://img.shields.io/npm/v/redux-query.svg?style=flat-square)](https://www.npmjs.com/package/redux-query)                                           | The core library for managing network requests with Redux.              |
| `redux-query-react`                | [![npm](https://img.shields.io/npm/v/redux-query-react.svg?style=flat-square)](https://www.npmjs.com/package/redux-query-react)                               | Library of APIs for integrating redux-query with your React components. |
| `redux-query-interface-superagent` | [![npm](https://img.shields.io/npm/v/redux-query-interface-superagent.svg?style=flat-square)](https://www.npmjs.com/package/redux-query-interface-superagent) | The recommended network interface that handles network requests.        |

## About

Brought to you by [Amplitude](https://amplitude.com/engineering). We're hiring!
