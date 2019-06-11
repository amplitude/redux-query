// @flow

import React from 'react';

const useConstCallback = <T>(callback: T): T => {
  const ref = React.useRef(callback);

  return ref.current;
};

export default useConstCallback;
