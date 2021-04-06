---
id: hacker-news
title: Hacker News
---

This example shows how to use redux-query, redux-query-react, and redux-query-interface-superagent to build a basic Hacker News client. You can run this example in the browser by clicking the button below:

[![Edit redux-query Hacker News Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/trusting-wilson-ndyzf?fontsize=14)

## Entry point

### `index.js`

```javascript
import React from 'react';
import { render } from 'react-dom';

import HackerNews from './components/HackerNews';
import store from './store';

render(<HackerNews store={store} />, document.getElementById('root'));
```

## Redux store

### `store.js`

```javascript
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { entitiesReducer, queriesReducer, queryMiddleware } from 'redux-query';
import superagentInterface from 'redux-query-interface-superagent';

export const getQueries = (state) => state.queries;
export const getEntities = (state) => state.entities;

const reducer = combineReducers({
  entities: entitiesReducer,
  queries: queriesReducer,
});

const store = createStore(
  reducer,
  applyMiddleware(queryMiddleware(superagentInterface, getQueries, getEntities)),
);

export default store;
```

## Query configs

### `query-configs/stories.js`

```javascript
export const topStoriesRequest = () => {
  return {
    url: `https://hacker-news.firebaseio.com/v0/topstories.json`,
    transform: (body) => ({
      // The server responds with an array of IDs
      topStoryIds: body,
    }),
    update: {
      topStoryIds: (prev, next) => {
        // Discard previous `response` value (we don't need it anymore).
        return next;
      },
    },
  };
};

export const itemRequest = (itemId) => {
  return {
    url: `https://hacker-news.firebaseio.com/v0/item/${itemId}.json`,
    transform: (body) => ({
      // The server responds with the metadata for that item
      itemsById: {
        [itemId]: body,
      },
    }),
    update: {
      itemsById: (prev, next) => {
        return {
          ...prev,
          ...next,
        };
      },
    },
  };
};
```

## Selectors

### `selectors/stories.js`

```javascript
const emptyArray = [];

export const getTopStoryIds = (state) => {
  return state.entities.topStoryIds || emptyArray;
};

export const getItem = (state, itemId) => {
  return (state.entities.itemsById || {})[itemId];
};
```

## Components

### `components/Item.js`

```javascript
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useRequest } from 'redux-query-react';

import * as storyQueryConfigs from '../query-configs/stories';
import * as storySelectors from '../selectors/stories';

const Item = (props) => {
  const [{ isPending }] = useRequest(storyQueryConfigs.itemRequest(props.itemId));
  const item = useSelector((state) => storySelectors.getItem(state, props.itemId));

  return (
    <li>
      {isPending && 'Loading…'}
      {!!item && (
        <div>
          <div>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
          </div>
          <div>
            {item.score} points by{' '}
            <a
              href={`https://news.ycombinator.com/user?id=${item.by}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.by}
            </a>
          </div>
        </div>
      )}
    </li>
  );
};

export default Item;
```

### `components/TopStories.js`

```javascript
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useRequest } from 'redux-query-react';

import Item from '../components/Item';
import * as storyQueryConfigs from '../query-configs/stories';
import * as storySelectors from '../selectors/stories';

const TopStories = (props) => {
  useRequest(storyQueryConfigs.topStoriesRequest());
  const topStoryIds = useSelector(storySelectors.getTopStoryIds);

  return (
    <ol>
      {topStoryIds.slice(0, 30).map((itemId) => (
        <Item itemId={itemId} key={itemId} />
      ))}
    </ol>
  );
};

export default TopStories;
```

### `components/HackerNews.js`

```javascript
import * as React from 'react';
import { Provider } from 'react-redux';
import { Provider as ReduxQueryProvider } from 'redux-query-react';

import TopStories from '../components/TopStories';
import { getQueries } from '../store';

const HackerNews = (props) => {
  return (
    <Provider store={props.store}>
      <ReduxQueryProvider queriesSelector={getQueries}>
        <>
          <h1>Hacker News</h1>
          <TopStories />
        </>
      </ReduxQueryProvider>
    </Provider>
  );
};

export default HackerNews;
```
