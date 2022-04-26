import * as React from 'react';
import { render, waitForElement, getByTestId, fireEvent } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { entitiesReducer, queriesReducer, queryMiddleware } from 'redux-query';

import useRequestOnDemand from '../../src/hooks/use-request-on-demand';
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

describe('useRequestOnDemand', () => {
  beforeEach(() => {
    store = createStore(
      reducer,
      applyMiddleware(queryMiddleware(mockNetworkInterface, getQueries, getEntities)),
    );
  });

  it('loads data initially and supports refresh', async () => {
    const Content = () => {
      const [{ isPending }, request] = useRequestOnDemand(() => ({
        url: '/echo',
        body: {
          value: 'BodyValue',
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
          <button data-testid="submit-button" onClick={request}>
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

    // Request finished, message should be visible

    let loadedContentNode = await waitForElement(() => getByTestId(container, 'loaded-content'));
    expect(loadedContentNode.textContent).toBe('BodyValue');
  });

  it('supplies a callback that returns a promise', async () => {
    const Content = () => {
      const [message, setMessage] = React.useState(null);

      const [{ isPending }, request] = useRequestOnDemand(() => ({
        url: '/echo',
        body: {
          value: 'BodyValue',
        },
        update: {
          message: (prevValue, newValue) => newValue,
        },
      }));

      const onSubmit = React.useCallback(() => {
        request().then(result => setMessage(result.body.message));
      }, [request]);

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

    // Request finished, message should be visible

    let loadedContentNode = await waitForElement(() => getByTestId(container, 'loaded-content'));
    expect(loadedContentNode.textContent).toBe('BodyValue');
  });
});
