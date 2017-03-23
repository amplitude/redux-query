import get from 'lodash.get';

import { reconcileQueryKey } from '../lib/query-key';

export const isFinished = (urlOrConfig, body) => (queriesState) => {
    let queryKey;

    if (typeof urlOrConfig === 'string') {
        queryKey = reconcileQueryKey({ url: urlOrConfig, body });
    } else {
        queryKey = reconcileQueryKey(urlOrConfig);
    }

    return get(queriesState, [queryKey, 'isFinished']);
};

export const isPending = (urlOrConfig, body) => (queriesState) => {
    let queryKey;

    if (typeof urlOrConfig === 'string') {
        queryKey = reconcileQueryKey({ url: urlOrConfig, body });
    } else {
        queryKey = reconcileQueryKey(urlOrConfig);
    }

    return get(queriesState, [queryKey, 'isPending']);
};

export const status = (urlOrConfig, body) => (queriesState) => {
    let queryKey;

    if (typeof urlOrConfig === 'string') {
        queryKey = reconcileQueryKey({ url: urlOrConfig, body });
    } else {
        queryKey = reconcileQueryKey(urlOrConfig);
    }

    return get(queriesState, [queryKey, 'status']);
};

export const lastUpdated = (urlOrConfig, body) => (queriesState) => {
    let queryKey;

    if (typeof urlOrConfig === 'string') {
        queryKey = reconcileQueryKey({ url: urlOrConfig, body });
    } else {
        queryKey = reconcileQueryKey(urlOrConfig);
    }

    return get(queriesState, [queryKey, 'lastUpdated']);
};

export const queryCount = (urlOrConfig, body) => (queriesState) => {
    let queryKey;

    if (typeof urlOrConfig === 'string') {
        queryKey = reconcileQueryKey({ url: urlOrConfig, body });
    } else {
        queryKey = reconcileQueryKey(urlOrConfig);
    }

    return get(queriesState, [queryKey, 'queryCount']);
};

export const responseBody = (urlOrConfig, body) => (queriesState) => {
    let queryKey;

    if (typeof urlOrConfig === 'string') {
        queryKey = reconcileQueryKey({ url: urlOrConfig, body });
    } else {
        queryKey = reconcileQueryKey(urlOrConfig);
    }

    return get(queriesState, [queryKey, 'responseBody']);
};
