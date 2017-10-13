import stringify from 'json-stable-stringify';

export const getQueryKey = ({ url, body, queryKey }) => {
  if (queryKey !== null && queryKey !== undefined) {
    return queryKey;
  } else {
    return stringify({ url, body });
  }
};
