import * as React from 'react';
import { Store, AnyAction } from 'redux';
import { Provider } from 'react-redux';
import { Provider as ReduxQueryProvider } from 'redux-query-react';

import TopStories from '../components/TopStories';
import { getQueries } from '../../../app/store';

export function HackerNews(props: { store: Store<any, AnyAction> }) {
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
}
