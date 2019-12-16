// @flow

import * as React from 'react';

import useRequest from '../../src/hooks/use-requests';

const Card = () => {
  const [{ isPending }] = useRequest([
    {
      url: '/api',
    },
    { url: '/test' },
  ]);

  return <div>{isPending ? 'loading…' : 'loaded'}</div>;
};

export const App = () => {
  return <Card />;
};
