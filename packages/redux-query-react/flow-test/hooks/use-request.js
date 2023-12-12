// @flow

import * as React from 'react';

import useRequest from '../../src/hooks/use-request';

const Card = () => {
  const [{ isPending }] = useRequest({
    url: '/api',
    customQueryConfig: {
      retryableStatusCodes: [200],
    },
  });

  return <div>{isPending ? 'loading…' : 'loaded'}</div>;
};

export const App = () => {
  return <Card />;
};
