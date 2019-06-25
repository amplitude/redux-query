// @flow

import React from 'react';

/**
 * Unlike `useCallback`, `useConstCallback` guarantees memoization, which can be relied upon to
 * explicitly control when certain side effects occur when used as a dependency for `useEffect`
 * hooks.
 */
const useConstCallback = <T>(callback: T): T => {
  const ref = React.useRef<T>(callback);

  return ref.current;
};

export default useConstCallback;
