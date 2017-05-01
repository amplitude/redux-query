import * as actionTypes from '../constants/action-types';

export const requestStart = (url, body, networkHandler, meta, queryKey) => {
    return {
        type: actionTypes.REQUEST_START,
        url,
        body,
        networkHandler,
        meta,
        queryKey,
    };
};

export const requestSuccess = (
    url,
    body,
    status,
    entities,
    meta,
    queryKey,
    responseBody,
    responseText,
    responseHeaders
) => {
    return {
        type: actionTypes.REQUEST_SUCCESS,
        url,
        body,
        status,
        entities,
        responseBody,
        responseText,
        responseHeaders,
        meta,
        queryKey,
        time: Date.now(),
    };
};

export const requestFailure = (url, body, status, responseBody, meta, queryKey, responseText, responseHeaders) => {
    return {
        type: actionTypes.REQUEST_FAILURE,
        url,
        body,
        status,
        responseBody,
        responseText,
        responseHeaders,
        meta,
        queryKey,
        time: Date.now(),
    };
};

export const mutateStart = (url, body, networkHandler, optimisticEntities, queryKey, meta) => {
    return {
        type: actionTypes.MUTATE_START,
        url,
        body,
        networkHandler,
        optimisticEntities,
        queryKey,
        meta,
    };
};

export const mutateSuccess = (
    url,
    body,
    status,
    entities,
    queryKey,
    responseBody,
    responseText,
    responseHeaders,
    meta
) => {
    return {
        type: actionTypes.MUTATE_SUCCESS,
        url,
        body,
        status,
        responseBody,
        responseText,
        responseHeaders,
        entities,
        queryKey,
        time: Date.now(),
        meta,
    };
};

export const mutateFailure = (
    url,
    body,
    status,
    rolledBackEntities,
    queryKey,
    responseBody,
    responseText,
    responseHeaders,
    meta
) => {
    return {
        type: actionTypes.MUTATE_FAILURE,
        url,
        body,
        status,
        responseBody,
        responseText,
        responseHeaders,
        rolledBackEntities,
        queryKey,
        time: Date.now(),
        meta,
    };
};

export const requestAsync = (
    {
        body,
        force,
        meta,
        options,
        queryKey,
        retry,
        transform,
        update,
        url,
    }
) => {
    return {
        type: actionTypes.REQUEST_ASYNC,
        body,
        force,
        queryKey,
        meta,
        options,
        retry,
        transform,
        update,
        url,
    };
};

export const mutateAsync = (
    {
        body,
        meta,
        optimisticUpdate,
        options,
        queryKey,
        rollback,
        transform,
        update,
        url,
    }
) => {
    return {
        type: actionTypes.MUTATE_ASYNC,
        body,
        meta,
        optimisticUpdate,
        options,
        queryKey,
        rollback,
        transform,
        update,
        url,
    };
};

export const cancelQuery = queryKey => {
    return {
        type: actionTypes.CANCEL_QUERY,
        queryKey,
    };
};

export const removeEntity = path => {
    return {
        type: actionTypes.REMOVE_ENTITY,
        path,
    };
};

export const removeEntities = paths => {
    return {
        type: actionTypes.REMOVE_ENTITIES,
        paths,
    };
};
