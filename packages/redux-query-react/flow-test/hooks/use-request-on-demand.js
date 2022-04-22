// @flow

import * as React from 'react';

import useRequestOnDemand from '../../src/hooks/use-request-on-demand';

const Card = () => {
  const [{ isPending }, request] = useRequestOnDemand((force: boolean) => ({
    url: '/api',
    force,
  }));

  return (
    <div>
      {isPending === true ? 'loading…' : 'loaded'}
      {/* $FlowFixMe expected */}
      <button onClick={() => request('false')}>Trigger</button>
      <button onClick={() => request(true)}>Trigger</button>
    </div>
  );
};

export const App = () => {
  return <Card />;
};
