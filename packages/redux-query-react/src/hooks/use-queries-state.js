// @flow

import * as React from 'react';
import { useSelector } from 'react-redux';
import { querySelectors } from 'redux-query';
import type { QueryConfig } from 'redux-query/types.js.flow';

import ReduxQueryContext from '../context';
import type { QueriesState } from '../types';

const useQueriesState = (queryConfigs: Array<QueryConfig>): QueriesState => {
  const contextValue = React.useContext(ReduxQueryContext);

  if (!contextValue) {
    throw new Error(
      `Could not find redux-query-react's context. Be sure to render a redux-query <Provider> near the root of your React tree.`,
    );
  }

  const { queriesSelector } = contextValue;

  const isPending = useSelector(state =>
    queryConfigs.some(queryConfig => querySelectors.isPending(queriesSelector(state), queryConfig)),
  );

  const isFinished = useSelector(state =>
    queryConfigs.every(queryConfig =>
      querySelectors.isFinished(queriesSelector(state), queryConfig),
    ),
  );

  const queryState = React.useMemo(
    () => ({
      isPending,
      isFinished,
    }),
    [isFinished, isPending],
  );

  return queryState;
};

export default useQueriesState;
