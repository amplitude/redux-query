---
id: simple
title: Simple Example
---

This example is a very simple web app that has only one feature – you can view and update your username. The purpose of this example is to demonstrate how requests and mutations (including optimistic updates) work with redux-query.

[![Edit redux-query Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/redux-query-hacker-news-example-jpoko?fontsize=14)

**Note**: This example fakes a server with a custom mock [network interface](../network-interfaces). In a real app, you would want to use a network interface that actually communicates to a server via HTTP.

## Entry point

### `index.js`

```javascript
import React from 'react';
import { render } from 'react-dom';

import App from './components/App';
import store from './store';

render(<App store={store} />, document.getElementById('root'));
```

## Redux store

### `store.js`

```javascript
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { entitiesReducer, queriesReducer, queryMiddleware } from 'redux-query';

import mockNetworkInterface from './mock-network-interface';

export const getQueries = state => state.queries;
export const getEntities = state => state.entities;

const reducer = combineReducers({
  entities: entitiesReducer,
  queries: queriesReducer,
});

const store = createStore(
  reducer,
  applyMiddleware(queryMiddleware(mockNetworkInterface, getQueries, getEntities)),
);

export default store;
```

## Query configs

### `query-configs/name.js`

```javascript
export const nameRequest = () => {
  return {
    url: `/api/name`,
    update: {
      name: (prev, next) => next,
    },
  };
};

export const changeNameMutation = (name, optimistic) => {
  const queryConfig = {
    url: `/api/change-name`,
    body: {
      name,
    },
    update: {
      name: (prev, next) => next,
    },
  };

  if (optimistic) {
    queryConfig.optimisticUpdate = {
      name: () => name,
    };
  }

  return queryConfig;
};
```

## Selectors

### `selectors/name.js`

```javascript
export const getName = state => state.entities.name;
```

## Components

### `components/ChangeUsernameForm.js`

```javascript
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useRequest, useMutation } from 'redux-query-react';

import * as nameQueryConfigs from '../query-configs/name';
import * as nameSelectors from '../selectors/name';

const ChangeUsernameForm = props => {
  const [inputValue, setInputValue] = React.useState('');
  const [status, setStatus] = React.useState(null);
  const [error, setError] = React.useState(null);

  const username = useSelector(nameSelectors.getName);

  useRequest(nameQueryConfigs.nameRequest());

  const [queryState, changeName] = useMutation(optimistic =>
    nameQueryConfigs.changeNameMutation(inputValue, optimistic),
  );

  const submit = React.useCallback(
    optimistic => {
      changeName(optimistic).then(result => {
        if (result !== 200) {
          setError(result.text);
        }

        setStatus(result.status);
      });
    },
    [changeName],
  );

  const isPending = queryState.isPending;

  return (
    <div>
      <h2>Current username</h2>
      <p>{username || <em>(no username set)</em>}</p>
      <h2>Change username</h2>
      <form
        onSubmit={e => {
          // Prevent default form behavior.
          e.preventDefault();
        }}
      >
        <input
          type="text"
          value={inputValue}
          placeholder="Enter a new username"
          disabled={isPending}
          onChange={e => {
            setInputValue(e.target.value);
          }}
        />
        <input type="submit" value="Submit" onClick={() => submit(false)} disabled={isPending} />
        <input
          type="submit"
          value="I'm Feeling Optimistic"
          onClick={() => submit(true)}
          disabled={isPending}
        />
        {isPending ? (
          <p>Loading…</p>
        ) : (
          typeof status === 'number' && (
            <>
              {status === 200 ? (
                <p>Success!</p>
              ) : (
                <p>
                  An error occurred: &quot;
                  {error}
                  &quot;.
                </p>
              )}
            </>
          )
        )}
      </form>
    </div>
  );
};

export default ChangeUsernameForm;
```

### `components/App.js`

```javascript
import * as React from 'react';
import { Provider } from 'react-redux';
import { Provider as ReduxQueryProvider } from 'redux-query-react';

import ChangeUsernameForm from '../components/ChangeUsernameForm';
import { getQueries } from '../store';

const Intro = () => {
  return (
    <>
      <h1>Instructions</h1>
      <p>
        This example is a very simple web app that has only one feature – you can view and update
        your username. The purpose of this example is to demonstrate how requests and mutations
        (including optimistic updates) work with redux-query.
      </p>
      <ol>
        <li>
          Pretend that you have used this app before. Wait for your username to load under the
          "Current username" header.
        </li>
        <li>Enter a username into the text input field.</li>
        <li>
          Click "Submit" and wait for the text you entered to be accepted and reflected under the
          "Current username" header.
        </li>
        <li>Clear the text input field to be empty.</li>
        <li>
          Click "Submit" and wait for the error message. Note this did not change the current
          username that is displayed below the "Current username" header.
        </li>
        <li>Enter a new username into the text input field.</li>
        <li>
          Click "I'm Feeling Optimistic" and see how the current username displayed under the
          "Current username" header updates immediately.
        </li>
        <li>Clear the text input field to be empty.</li>
        <li>
          Click "I'm Feeling Optimistic" and see how the current username displayed under the
          "Current username" header updates immediately. Then a second later when the mutation
          finishes, see how the username reverts to the previous value.
        </li>
      </ol>
    </>
  );
};

const App = props => {
  return (
    <Provider store={props.store}>
      <ReduxQueryProvider queriesSelector={getQueries}>
        <Intro />
        <hr />
        <ChangeUsernameForm />
      </ReduxQueryProvider>
    </Provider>
  );
};

export default App;
```

## Custom mock network interface

### `mock-network-interface.js`

```javascript
const artificialDelayDuration = 1000;

// Fake database to record the name
const memoryDb = {
  name: 'jhalpert78',
};

const mockNetworkInterface = (url, method, { body }) => {
  let timeoutId = null;

  return {
    abort() {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    },
    execute(callback) {
      if (url.match(/^\/api\/name/)) {
        // Endpoint for getting the current name

        if (method.toUpperCase() === 'GET') {
          timeoutId = setTimeout(() => {
            callback(null, 200, {
              name: memoryDb.name,
            });
          }, artificialDelayDuration);
        } else {
          callback(null, 405);
        }
      } else if (url.match(/^\/api\/change-name/)) {
        // Endpoint for changing the name

        if (method !== 'POST') {
          callback(null, 405);
          return;
        }

        if (!body.name) {
          timeoutId = setTimeout(() => {
            callback(null, 400, null, 'Username cannot be empty');
          }, artificialDelayDuration);
          return;
        }

        if (body.name.trim() !== body.name || !body.name.match(/^[a-zA-Z0-9]+$/)) {
          timeoutId = setTimeout(() => {
            callback(
              null,
              400,
              null,
              'A valid username must only contain alphanumerics with no leading or trailing spaces',
            );
          }, artificialDelayDuration);
          return;
        }

        memoryDb.name = body.name;

        timeoutId = setTimeout(() => {
          const responseBody = {
            name: memoryDb.name,
          };
          callback(null, 200, responseBody, JSON.stringify(responseBody));
        }, artificialDelayDuration);
      } else {
        callback(null, 404);
      }
    },
  };
};

export default mockNetworkInterface;
```
