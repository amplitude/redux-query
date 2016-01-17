import superagent from 'superagent'
import { normalize } from 'normalizr';
import get from 'lodash/get';

import * as actionTypes from '../constants/action-types';

export const requestStart = (url) => {
    return {
        type: actionTypes.REQUEST_START,
        url,
    };
};

export const requestSuccess = (url, status, entities) => {
    return {
        type: actionTypes.REQUEST_SUCCCESS,
        url,
        status,
        entities,
    };
};

export const requestFailure = (url, status) => {
    return {
        type: actionTypes.REQUEST_SUCCCESS,
        url,
        status,
    };
};

export const requestAsync = (url, schema, requestsSelector) => (dispatch, getState) => {
    const state = getState();
    const requests = requestsSelector(state);
    const request = requests[url];
    const isPending = get(request, ['isPending'], false);

    if (!isPending) {
        dispatch(requestStart(url));

        superagent.get(url)
            .end((err, response) => {
                if (err) {
                    dispatch(requestFailure(url, response.status));
                } else {
                    const normalized = normalize(response.body, schema);
                    dispatch(requestSuccess(url, response.status, normalized.entities));
                }
            });
    }
};
