import stringify from 'json-stable-stringify';

export const getQueryKey = (url, body) => {
    return stringify({ url, body });
};

export const reconcileQueryKey = ({ url, body, queryKey }) => {
    if (queryKey !== null && queryKey !== undefined) {
        return queryKey;
    } else {
        return getQueryKey(url, body);
    }
};
