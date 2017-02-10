import stringify from 'json-stable-stringify';

const getQueryKey = (url, body) => {
    return stringify({ url, body });
};

export const reconcileQueryKey = (url, body, providedQueryKey) => {
    if (providedQueryKey !== null && providedQueryKey !== undefined) {
        return providedQueryKey;
    } else {
        return getQueryKey(url, body);
    }
};

export default getQueryKey;
