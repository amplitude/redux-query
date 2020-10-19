import * as React from 'react';

import useMutation from '../../src/hooks/use-mutation';

const Card = () => {
  const [{ isPending }, mutate] = useMutation((force: boolean) => ({
    url: '/api',
    force,
  }));

  return (
    <div>
      {isPending ? 'loading…' : 'loaded'}
      {/* $FlowFixMe expected */}
      <button onClick={() => mutate('false')}>Trigger</button>
      <button onClick={() => mutate(true)}>Trigger</button>
    </div>
  );
};

export const App = () => {
  return <Card />;
};
