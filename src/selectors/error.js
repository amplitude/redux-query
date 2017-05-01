import get from 'lodash.get';

import { reconcileQueryKey } from '../lib/query-key';

export const responseBody = (urlOrConfig, body) => errorsState => {
    let queryKey;

    if (typeof urlOrConfig === 'string') {
        queryKey = reconcileQueryKey({ url: urlOrConfig, body });
    } else {
        queryKey = reconcileQueryKey(urlOrConfig);
    }

    return get(errorsState, [queryKey, 'responseBody']);
};

export const responseText = (urlOrConfig, body) => errorsState => {
    let queryKey;

    if (typeof urlOrConfig === 'string') {
        queryKey = reconcileQueryKey({ url: urlOrConfig, body });
    } else {
        queryKey = reconcileQueryKey(urlOrConfig);
    }

    return get(errorsState, [queryKey, 'responseText']);
};

export const responseHeaders = (urlOrConfig, body) => errorsState => {
    let queryKey;

    if (typeof urlOrConfig === 'string') {
        queryKey = reconcileQueryKey({ url: urlOrConfig, body });
    } else {
        queryKey = reconcileQueryKey(urlOrConfig);
    }

    return get(errorsState, [queryKey, 'responseHeaders']);
};
