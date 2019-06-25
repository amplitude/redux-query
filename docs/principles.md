---
id: principles
title: Principles
---

## Customizable and extensible

Inspired by Redux itself, redux-query aims to maintain a small API surface. However, this doesn't mean that redux-query is limited to basic use cases.

redux-query works across several layers of abstraction – the network layer, the Redux action/state layer, and the UI layer. Each of these layers are independent and can be customized to satisfy your use case. Using Angular or Ember? No problem – just don't use react-redux-react. Want to use your favorite network request library? Build a network interface that wraps that library. Need to add extra headers to each of your requests? Add a custom middleware to your Redux store that processes all redux-query actions. Want to implement custom throttling behaviors? It's possible with a custom network interface.

## Encourages best practices

It should be difficult to use redux-query in a bad way that could trigger bad bugs or performance issues. For example, redux-query encourages [normalization](https://redux.js.org/introduction/learning-resources#normalization) of entities in your Redux state.
