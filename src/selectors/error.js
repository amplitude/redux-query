import { get } from '../lib/object';

import { getQueryKey } from '../lib/query-key';

export const responseBody = (errorsState, queryConfig) => {
  if (queryConfig) {
    const queryKey = getQueryKey(queryConfig);

    return get(errorsState, [queryKey, 'responseBody']);
  }
};

export const responseText = (errorsState, queryConfig) => {
  if (queryConfig) {
    const queryKey = getQueryKey(queryConfig);

    return get(errorsState, [queryKey, 'responseText']);
  }
};

export const responseHeaders = (errorsState, queryConfig) => {
  if (queryConfig) {
    const queryKey = getQueryKey(queryConfig);

    return get(errorsState, [queryKey, 'responseHeaders']);
  }
};
