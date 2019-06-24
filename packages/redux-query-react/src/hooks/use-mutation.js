import * as React from 'react';
import { useDispatch } from 'react-redux';
import { mutateAsync } from 'redux-query';

import useConstCallback from './use-const-callback';
import useQueryState from './use-query-state';

const useMutation = makeQueryConfig => {
  const reduxDispatch = useDispatch();

  const isPendingRef = React.useRef(false);

  const finishedCallback = useConstCallback(() => {
    isPendingRef.current = false;
  });

  const transformQueryConfig = useConstCallback(queryConfig => {
    return {
      ...queryConfig,
      unstable_preDispatchCallback: finishedCallback,
    };
  });

  const [queryConfig, setQueryConfig] = React.useState(null);

  const queryState = useQueryState(queryConfig);

  const mutate = React.useCallback(
    (...args) => {
      const queryConfig = makeQueryConfig(...args);

      if (!queryConfig) {
        return;
      }

      setQueryConfig(transformQueryConfig(queryConfig));

      const promise = reduxDispatch(mutateAsync(queryConfig));

      if (promise) {
        isPendingRef.current = true;
      }

      return promise;
    },
    [makeQueryConfig, reduxDispatch, transformQueryConfig],
  );

  return [queryState, mutate];
};

export default useMutation;
