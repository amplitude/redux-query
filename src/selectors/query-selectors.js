import get from 'lodash.get';

import getQueryKey from '../lib/get-query-key';

export const isFinished = (url, body) => (queriesState) => {
    return get(queriesState, [getQueryKey(url, body), 'isFinished']);
};

export const isPending = (url, body) => (queriesState) => {
    return get(queriesState, [getQueryKey(url, body), 'isPending']);
};

export const status = (url, body) => (queriesState) => {
    return get(queriesState, [getQueryKey(url, body), 'status']);
};

export const lastUpdated = (url, body) => (queriesState) => {
    return get(queriesState, [getQueryKey(url, body), 'lastUpdated']);
};

export const queryCount = (url, body) => (queriesState) => {
    return get(queriesState, [getQueryKey(url, body), 'queryCount']);
};
