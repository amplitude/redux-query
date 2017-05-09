import * as actionTypes from '../constants/action-types';

export const requestStart = (
    {
        body,
        meta,
        networkHandler,
        queryKey,
        url,
    }
) => {
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
    {
        body,
        entities,
        meta,
        queryKey,
        responseBody,
        responseHeaders,
        responseText,
        status,
        url,
    }
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

export const requestFailure = (
    {
        body,
        meta,
        queryKey,
        responseBody,
        responseHeaders,
        responseText,
        status,
        url,
    }
) => {
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

export const mutateStart = (
    {
        body,
        meta,
        networkHandler,
        optimisticEntities,
        queryKey,
        url,
    }
) => {
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
    {
        body,
        entities,
        meta,
        queryKey,
        responseBody,
        responseHeaders,
        responseText,
        status,
        url,
    }
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
    {
        body,
        meta,
        queryKey,
        responseBody,
        responseHeaders,
        responseText,
        rolledBackEntities,
        status,
        url,
    }
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
        unstable_preDispatchCallback,
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
        unstable_preDispatchCallback,
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

export const updateEntities = update => {
    return {
        type: actionTypes.UPDATE_ENTITIES,
        update,
    };
};
