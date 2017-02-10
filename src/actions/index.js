import * as actionTypes from '../constants/action-types';

export const requestStart = (url, body, request, meta, queryKey) => {
    return {
        type: actionTypes.REQUEST_START,
        url,
        body,
        request,
        meta,
        queryKey,
    };
};

export const requestSuccess = (url, body, status, entities, meta, queryKey) => {
    return {
        type: actionTypes.REQUEST_SUCCESS,
        url,
        body,
        status,
        entities,
        meta,
        queryKey,
        time: Date.now(),
    };
};

export const requestFailure = (url, body, status, responseBody, meta, queryKey) => {
    return {
        type: actionTypes.REQUEST_FAILURE,
        url,
        body,
        status,
        responseBody,
        meta,
        queryKey,
        time: Date.now(),
    };
};

export const mutateStart = (url, body, request, optimisticEntities, queryKey) => {
    return {
        type: actionTypes.MUTATE_START,
        url,
        body,
        request,
        optimisticEntities,
        queryKey,
    };
};

export const mutateSuccess = (url, body, status, entities, queryKey) => {
    return {
        type: actionTypes.MUTATE_SUCCESS,
        url,
        body,
        status,
        entities,
        queryKey,
        time: Date.now(),
    };
};

export const mutateFailure = (url, body, status, originalEntities, queryKey) => {
    return {
        type: actionTypes.MUTATE_FAILURE,
        url,
        body,
        status,
        originalEntities,
        queryKey,
        time: Date.now(),
    };
};

export const requestAsync = ({
    body,
    force,
    queryKey,
    meta,
    options,
    retry,
    transform,
    update,
    url,
}) => {
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

export const mutateAsync = ({
    body,
    onRequestEnd,
    optimisticUpdate,
    options,
    queryKey,
    transform,
    update,
    url,
}) => (dispatch) => {
    return dispatch({
        type: actionTypes.MUTATE_ASYNC,
        body,
        optimisticUpdate,
        options,
        queryKey,
        transform,
        update,
        url,
    }).then((responseMetadata) => {
        if (onRequestEnd) {
            dispatch(onRequestEnd(responseMetadata));
        }

        return responseMetadata;
    });
};

export const cancelQuery = (queryKey) => {
    return {
        type: actionTypes.CANCEL_QUERY,
        queryKey,
    };
};

export const removeEntity = (path) => {
    return {
        type: actionTypes.REMOVE_ENTITY,
        path,
    };
};

export const removeEntities = (paths) => {
    return {
        type: actionTypes.REMOVE_ENTITIES,
        paths,
    };
};
