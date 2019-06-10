import * as React from 'react';

import ReduxQueryContext from '../context';

const Provider = props => {
  const { queriesSelector } = props;
  const value = React.useMemo(() => ({ queriesSelector }), [queriesSelector]);

  return <ReduxQueryContext.Provider value={value}>{props.children}</ReduxQueryContext.Provider>;
};

export default React.memo(Provider);
