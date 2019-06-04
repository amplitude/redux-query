import * as React from 'react';
import { render, waitForElement, getByTestId, fireEvent } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { entitiesReducer, queriesReducer, queryMiddleware } from 'redux-query';

import useRequest from '../../src/hooks/use-request';

export const getQueries = state => state.queries;
export const getEntities = state => state.entities;

const reducer = combineReducers({
  entities: entitiesReducer,
  queries: queriesReducer,
});

const apiMessage = 'hello, world!';

const mockNetworkInterface = (url, method, options) => {
  return {
    abort() {
      // no op
    },
    execute(callback) {
      if (url === '/echo-headers') {
        setTimeout(() => {
          const status = 200;
          const body = {
            message: options.headers,
          };
          const text = JSON.stringify(body);
          const headers = {};

          callback(null, status, body, text, headers);
        }, 0);
      } else if (url === '/api') {
        setTimeout(() => {
          const status = 200;
          const body = {
            message: apiMessage,
          };
          const text = JSON.stringify(body);
          const headers = {};

          callback(null, status, body, text, headers);
        }, 0);
      } else {
        setTimeout(() => {
          callback(null, 404, {}, '{}', {});
        }, 0);
      }
    },
  };
};

let store;

const App = props => {
  return <Provider store={store}>{props.children}</Provider>;
};

describe('useRequest', () => {
  beforeEach(() => {
    store = createStore(
      reducer,
      applyMiddleware(queryMiddleware(mockNetworkInterface, getQueries, getEntities)),
    );
  });

  it('loads data initially and supports refresh', async () => {
    const Content = () => {
      const { isPending, forceRequest } = useRequest({
        url: '/api',
        update: {
          message: (prevValue, newValue) => newValue,
        },
      });
      const message = useSelector(state => state.entities.message);

      if (isPending) {
        return <div data-testid="loading-content">loading</div>;
      }

      return (
        <div>
          <div data-testid="loaded-content">{message}</div>
          <button data-testid="refresh-button" onClick={forceRequest}>
            refresh
          </button>
        </div>
      );
    };

    const { container } = render(
      <App>
        <Content />
      </App>,
    );

    // Initial loading

    let loadingContentNode = getByTestId(container, 'loading-content');
    expect(loadingContentNode.textContent).toBe('loading');

    // Loaded

    let loadedContentNode = await waitForElement(() => getByTestId(container, 'loaded-content'));
    expect(loadedContentNode.textContent).toBe(apiMessage);

    // Click refresh button

    let buttonNode = getByTestId(container, 'refresh-button');
    fireEvent.click(buttonNode);

    // We're in a loading state again

    loadingContentNode = await waitForElement(() => getByTestId(container, 'loading-content'));
    expect(loadingContentNode.textContent).toBe('loading');

    // Loaded again

    loadedContentNode = await waitForElement(() => getByTestId(container, 'loaded-content'));
    expect(loadedContentNode.textContent).toBe(apiMessage);
  });

  it('cancels pending requests as part of cleanup', async () => {
    const Content = () => {
      const { isPending, forceRequest } = useRequest({
        url: '/api',
        update: {
          message: (prevValue, newValue) => newValue,
        },
      });
      const message = useSelector(state => state.entities.message);

      if (isPending) {
        return <div data-testid="loading-content">loading</div>;
      }

      return (
        <div>
          <div data-testid="loaded-content">{message}</div>
          <button data-testid="refresh-button" onClick={forceRequest}>
            refresh
          </button>
        </div>
      );
    };

    const Router = () => {
      const [path, setPath] = React.useState('/');

      return (
        <div>
          {path === '/' ? <Content /> : <div>404</div>}
          <a
            data-testid="broken-link"
            href="/broken-link"
            onClick={e => e.preventDefault() && setPath('broken-link')}
          >
            broken link
          </a>
        </div>
      );
    };

    const { container } = render(
      <App>
        <Router />
      </App>,
    );

    // Initial loading

    let loadingContentNode = getByTestId(container, 'loading-content');
    expect(loadingContentNode.textContent).toBe('loading');

    // Loaded

    let brokenLinkNode = await waitForElement(() => getByTestId(container, 'broken-link'));
    fireEvent.click(brokenLinkNode);
  });
});
