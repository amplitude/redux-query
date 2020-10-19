import * as React from 'react';
import { render, waitForElement, getByTestId, fireEvent } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { entitiesReducer, queriesReducer, queryMiddleware } from 'redux-query';

import useMutation from '../../src/hooks/use-mutation';
import ReduxQueryProvider from '../../src/components/Provider';

export const getQueries = state => state.queries;
export const getEntities = state => state.entities;

const reducer = combineReducers({
  entities: entitiesReducer,
  queries: queriesReducer,
});

const artificialNetworkDelay = 100;

const mockNetworkInterface = (url, method, { body: requestBody }) => {
  let timeoutId = null;

  return {
    abort() {
      clearTimeout(timeoutId);
    },
    execute(callback) {
      if (url === '/echo') {
        timeoutId = setTimeout(() => {
          const status = 200;
          const body = {
            message: requestBody.value,
          };
          const text = JSON.stringify(body);
          const headers = {};

          callback(null, status, body, text, headers);
        }, artificialNetworkDelay);
      } else {
        timeoutId = setTimeout(() => {
          callback(null, 404, {}, '{}', {});
        }, artificialNetworkDelay);
      }
    },
  };
};

let store;

const App = props => {
  return (
    <Provider store={store}>
      <ReduxQueryProvider queriesSelector={getQueries}>{props.children}</ReduxQueryProvider>
    </Provider>
  );
};

describe('useMutation', () => {
  beforeEach(() => {
    store = createStore(
      reducer,
      applyMiddleware(queryMiddleware(mockNetworkInterface, getQueries, getEntities)),
    );
  });

  it('loads data initially and supports refresh', async () => {
    const Content = () => {
      const [isPending, mutate] = useMutation(() => ({
        url: '/echo',
        body: {
          value: 'Ryan',
        },
        update: {
          message: (prevValue, newValue) => newValue,
        },
      }));
      const message = useSelector(state => state.entities.message);

      return (
        <div>
          {message ? (
            <div data-testid="loaded-content">{message}</div>
          ) : (
            <div data-testid="empty-state">empty</div>
          )}
          {isPending && <div data-testid="loading-content">loading</div>}
          <button data-testid="submit-button" onClick={mutate}>
            submit
          </button>
        </div>
      );
    };

    const { container } = render(
      <App>
        <Content />
      </App>,
    );

    // Loaded

    let emptyStateNode = getByTestId(container, 'empty-state');
    expect(emptyStateNode.textContent).toBe('empty');

    // Click submit button

    let buttonNode = getByTestId(container, 'submit-button');
    fireEvent.click(buttonNode);

    // We're in a loading state now

    let loadingContentNode = await waitForElement(() => getByTestId(container, 'loading-content'));
    expect(loadingContentNode.textContent).toBe('loading');

    // Mutation finished, message should be visible

    let loadedContentNode = await waitForElement(() => getByTestId(container, 'loaded-content'));
    expect(loadedContentNode.textContent).toBe('Ryan');
  });

  it('supplies a callback that returns a promise', async () => {
    const Content = () => {
      const [message, setMessage] = React.useState(null);

      const [isPending, mutate] = useMutation(() => ({
        url: '/echo',
        body: {
          value: 'Ryan',
        },
        update: {
          message: (prevValue, newValue) => newValue,
        },
      }));

      const onSubmit = React.useCallback(() => {
        mutate().then(result => setMessage(result.body.message));
      }, [mutate]);

      return (
        <div>
          {message ? (
            <div data-testid="loaded-content">{message}</div>
          ) : (
            <div data-testid="empty-state">empty</div>
          )}
          {isPending && <div data-testid="loading-content">loading</div>}
          <button data-testid="submit-button" onClick={onSubmit}>
            submit
          </button>
        </div>
      );
    };

    const { container } = render(
      <App>
        <Content />
      </App>,
    );

    // Loaded

    let emptyStateNode = getByTestId(container, 'empty-state');
    expect(emptyStateNode.textContent).toBe('empty');

    // Click submit button

    let buttonNode = getByTestId(container, 'submit-button');
    fireEvent.click(buttonNode);

    // We're in a loading state now

    let loadingContentNode = await waitForElement(() => getByTestId(container, 'loading-content'));
    expect(loadingContentNode.textContent).toBe('loading');

    // Mutation finished, message should be visible

    let loadedContentNode = await waitForElement(() => getByTestId(container, 'loaded-content'));
    expect(loadedContentNode.textContent).toBe('Ryan');
  });
});
