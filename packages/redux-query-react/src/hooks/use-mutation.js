import * as React from 'react';
import { useDispatch } from 'react-redux';
import { mutateAsync } from 'redux-query';

import useConstCallback from './use-const-callback';
import useMemoizedQueryConfig from './use-memoized-query-config';

const useMutation = providedQueryConfig => {
  const reduxDispatch = useDispatch();

  const isPendingRef = React.useRef(false);

  const [isPending, setIsPending] = React.useState(false);

  const finishedCallback = useConstCallback(() => {
    setIsPending(false);
    isPendingRef.current = false;
  });

  const transformQueryConfigToAction = useConstCallback(queryConfig => {
    return {
      ...queryConfig,
      unstable_preDispatchCallback: finishedCallback,
    };
  });

  const queryConfig = useMemoizedQueryConfig(providedQueryConfig, transformQueryConfigToAction);

  const mutate = React.useCallback(() => {
    const promise = reduxDispatch(mutateAsync(queryConfig));

    if (promise) {
      setIsPending(true);
      isPendingRef.current = true;
    }
  }, [reduxDispatch, queryConfig]);

  return [isPending, mutate];
};

export default useMutation;
