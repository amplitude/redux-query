// @flow

import React from 'react';

type ReduxQueryContextValue = ?{
  queriesSelector: (state: any, ...any) => any,
};

const ReduxQueryContext = React.createContext<ReduxQueryContextValue>(null);

export default ReduxQueryContext;
