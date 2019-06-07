import stringify from 'json-stable-stringify';

export const getQueryKey = queryConfig => {
  if (!queryConfig) {
    return null;
  }

  const { url, body, queryKey } = queryConfig;

  if (queryKey !== null && queryKey !== undefined) {
    return queryKey;
  } else {
    return stringify({ url, body });
  }
};
