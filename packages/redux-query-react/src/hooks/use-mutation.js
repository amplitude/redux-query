import * as React from 'react';
import { useDispatch } from 'react-redux';
import { mutateAsync } from 'redux-query';

import useConstCallback from './use-const-callback';
import useMemoizedAction from './use-memoized-action';

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

  const requestReduxAction = useMemoizedAction(providedQueryConfig, transformQueryConfigToAction);

  const dispatchMutationToRedux = React.useCallback(
    action => {
      const promise = reduxDispatch(mutateAsync(action));

      if (promise) {
        setIsPending(true);
        isPendingRef.current = true;
      }
    },
    [reduxDispatch],
  );

  const mutate = React.useCallback(() => {
    dispatchMutationToRedux({
      ...requestReduxAction,
      force: true,
    });
  }, [dispatchMutationToRedux, requestReduxAction]);

  return [isPending, mutate];
};

export default useMutation;
