// @flow

import * as React from 'react';
import { useSelector } from 'react-redux';
import { querySelectors } from 'redux-query';
import type { QueryConfig } from 'redux-query/types.js.flow';

import ReduxQueryContext from '../context';
import type { QueryState } from '../types';

const useQueryState = (queryConfig: ?QueryConfig): QueryState => {
  const contextValue = React.useContext(ReduxQueryContext);

  if (!contextValue) {
    throw new Error(
      `Could not find redux-query-react's context. Be sure to render a redux-query <Provider> near the root of your React tree.`,
    );
  }

  const { queriesSelector } = contextValue;

  const isPending = useSelector(state =>
    querySelectors.isPending(queriesSelector(state), queryConfig),
  );

  const isFinished = useSelector(state =>
    querySelectors.isFinished(queriesSelector(state), queryConfig),
  );

  const status = useSelector(state => querySelectors.status(queriesSelector(state), queryConfig));

  const headers = useSelector(state => querySelectors.headers(queriesSelector(state), queryConfig));

  const lastUpdated = useSelector(state =>
    querySelectors.lastUpdated(queriesSelector(state), queryConfig),
  );

  const queryCount = useSelector(state =>
    querySelectors.queryCount(queriesSelector(state), queryConfig),
  );

  const queryState = React.useMemo(
    () => ({
      isPending,
      isFinished,
      status,
      headers,
      lastUpdated,
      queryCount,
    }),
    [headers, isFinished, isPending, lastUpdated, queryCount, status],
  );

  return queryState;
};

export default useQueryState;
