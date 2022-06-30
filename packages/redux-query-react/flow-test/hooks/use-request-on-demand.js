// @flow

import * as React from 'react';

import useRequestOnDemand from '../../src/hooks/use-request-on-demand';

const Card = () => {
  const [{ isPending }, request] = useRequestOnDemand((force?: boolean) => ({
    url: '/api',
    force,
  }));

  return (
    <div>
      {isPending === true ? 'loading…' : 'loaded'}
      {/* $FlowFixMe expected */}
      <button onClick={() => request('false')}>Trigger</button>
      <button onClick={() => request()}>Trigger force = true default</button>
      <button onClick={() => request(true)}>Trigger with force = true manually</button>
      <button onClick={() => request(false)}>Trigger with force = false manually</button>
    </div>
  );
};

export const App = () => {
  return <Card />;
};
