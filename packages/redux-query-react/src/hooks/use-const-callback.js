import React from 'react';

const useConstCallback = callback => {
  const ref = React.useRef(callback);

  return ref.current;
};

export default useConstCallback;
