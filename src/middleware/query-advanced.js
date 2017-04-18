import Backoff from 'backo';
import invariant from 'invariant';
import get from 'lodash.get';
import identity from 'lodash.identity';
import includes from 'lodash.includes';
import pick from 'lodash.pick';
import pickBy from 'lodash.pickby';

import { requestStart, requestFailure, requestSuccess, mutateStart, mutateFailure, mutateSuccess } from '../actions';
import * as actionTypes from '../constants/action-types';
import * as httpMethods from '../constants/http-methods';
import * as statusCodes from '../constants/status-codes';
import { reconcileQueryKey } from '../lib/query-key';

const updateEntities = (update, entities, transformed) => {
    // If update, not supplied, then no change to entities should be made

    return Object.keys(update || {}).reduce(
        (accum, key) => {
            accum[key] = update[key]((entities || {})[key], (transformed || {})[key]);

            return accum;
        },
        {}
    );
};

const optimisticUpdateEntities = (optimisticUpdate, entities) => {
    return Object.keys(optimisticUpdate).reduce(
        (accum, key) => {
            if (optimisticUpdate[key]) {
                accum[key] = optimisticUpdate[key](entities[key]);
            } else {
                accum[key] = entities[key];
            }

            return accum;
        },
        {}
    );
};

const rollbackEntities = (rollback = {}, initialEntities, entities) => {
    return Object.keys(rollback).reduce(
        (accum, key) => {
            if (rollback[key]) {
                accum[key] = rollback[key](initialEntities[key], entities[key]);
            } else {
                // Default to just reverting to the initial state for that
                // entity (before the optimistic update)
                accum[key] = initialEntities[key];
            }

            return accum;
        },
        {}
    );
};

const defaultConfig = {
    backoff: {
        maxAttempts: 5,
        minDuration: 300,
        maxDuration: 5000,
    },
    retryableStatusCodes: [
        statusCodes.UNKNOWN, // normally means a failed connection
        statusCodes.REQUEST_TIMEOUT,
        statusCodes.TOO_MANY_REQUESTS, // hopefully backoff stops this getting worse
        statusCodes.SERVICE_UNAVAILABLE,
        statusCodes.GATEWAY_TIMEOUT,
    ],
};

const getPendingQueries = queries => {
    return pickBy(queries, query => query.isPending);
};

const resOk = status => Math.floor(status / 100) === 2;

const queryMiddlewareAdvanced = networkAdapter => (queriesSelector, entitiesSelector, config = defaultConfig) => {
    return ({ dispatch, getState }) => next => action => {
        // TODO(ryan): add warnings when there are simultaneous requests and mutation queries for the same entities
        let returnValue;

        switch (action.type) {
            case actionTypes.REQUEST_ASYNC: {
                const {
                    url,
                    body,
                    force,
                    retry,
                    transform = identity,
                    update,
                    options = {},
                    meta,
                } = action;

                invariant(!!url, 'Missing required `url` field in action handler');
                invariant(!!update, 'Missing required `update` field in action handler');

                const queryKey = reconcileQueryKey(action);

                const state = getState();
                const queries = queriesSelector(state);

                const queriesState = queries[queryKey];
                const isPending = get(queriesState, ['isPending']);
                const status = get(queriesState, ['status']);
                const hasSucceeded = status >= 200 && status < 300;

                if (force || !queriesState || (retry && !isPending && !hasSucceeded)) {
                    returnValue = new Promise(resolve => {
                        const start = new Date();
                        const { method = httpMethods.GET } = options;

                        const request = networkAdapter(url, method, {
                            body,
                            headers: options.headers,
                            credentials: options.credentials,
                        });

                        let attempts = 0;
                        const backoff = new Backoff({
                            min: config.backoff.minDuration,
                            max: config.backoff.maxDuration,
                        });

                        const attemptRequest = () => {
                            dispatch(requestStart(url, body, request, meta, queryKey));

                            attempts += 1;

                            request.execute((err, resStatus, resBody, resText, resHeaders) => {
                                if (
                                    includes(config.retryableStatusCodes, resStatus) &&
                                    attempts < config.backoff.maxAttempts
                                ) {
                                    // TODO take into account Retry-After header if 503
                                    setTimeout(attemptRequest, backoff.duration());
                                    return;
                                }

                                let transformed;
                                let newEntities;

                                if (err || !resOk(resStatus)) {
                                    dispatch(
                                        requestFailure(
                                            url,
                                            body,
                                            resStatus,
                                            resBody,
                                            meta,
                                            queryKey,
                                            resText,
                                            resHeaders
                                        )
                                    );
                                } else {
                                    const callbackState = getState();
                                    const entities = entitiesSelector(callbackState);
                                    transformed = transform(resBody, resText);
                                    newEntities = updateEntities(update, entities, transformed);
                                    dispatch(
                                        requestSuccess(
                                            url,
                                            body,
                                            resStatus,
                                            newEntities,
                                            meta,
                                            queryKey,
                                            resBody,
                                            resText,
                                            resHeaders
                                        )
                                    );
                                }

                                const end = new Date();
                                const duration = end - start;
                                resolve({
                                    body: resBody,
                                    duration,
                                    status: resStatus,
                                    text: resText,
                                    transformed,
                                    entities: newEntities,
                                    headers: resHeaders,
                                });
                            });
                        };

                        attemptRequest();
                    });
                }

                break;
            }
            case actionTypes.MUTATE_ASYNC: {
                const {
                    url,
                    transform = identity,
                    update,
                    rollback,
                    body,
                    optimisticUpdate,
                    options = {},
                    meta,
                } = action;
                invariant(!!url, 'Missing required `url` field in action handler');

                const initialState = getState();
                const initialEntities = entitiesSelector(initialState);
                let optimisticEntities;

                if (optimisticUpdate) {
                    optimisticEntities = optimisticUpdateEntities(optimisticUpdate, initialEntities);
                }

                const queryKey = reconcileQueryKey(action);

                returnValue = new Promise(resolve => {
                    const start = new Date();
                    const { method = httpMethods.POST } = options;

                    const request = networkAdapter(url, method, {
                        body,
                        headers: options.headers,
                        credentials: options.credentials,
                    });

                    // Note: only the entities that are included in `optimisticUpdate` will be passed along in the
                    // `mutateStart` action as `optimisticEntities`
                    dispatch(mutateStart(url, body, request, optimisticEntities, queryKey, meta));

                    request.execute((err, resStatus, resBody, resText, resHeaders) => {
                        const state = getState();
                        const entities = entitiesSelector(state);
                        let transformed;
                        let newEntities;

                        if (err || !resOk(resStatus)) {
                            if (optimisticUpdate) {
                                const rolledBackEntities = rollbackEntities(
                                    rollback,
                                    pick(initialEntities, Object.keys(optimisticEntities)),
                                    pick(entities, Object.keys(optimisticEntities))
                                );

                                newEntities = {
                                    ...entities,
                                    ...rolledBackEntities,
                                };
                            } else {
                                newEntities = entities;
                            }

                            dispatch(
                                mutateFailure(
                                    url,
                                    body,
                                    resStatus,
                                    initialEntities,
                                    queryKey,
                                    resBody,
                                    resText,
                                    resHeaders,
                                    meta,
                                    newEntities
                                )
                            );
                        } else {
                            transformed = transform(resBody, resText);
                            newEntities = updateEntities(update, entities, transformed);

                            dispatch(
                                mutateSuccess(
                                    url,
                                    body,
                                    resStatus,
                                    newEntities,
                                    queryKey,
                                    resBody,
                                    resText,
                                    resHeaders,
                                    meta
                                )
                            );
                        }

                        const end = new Date();
                        const duration = end - start;
                        resolve({
                            body: resBody,
                            duration,
                            status: resStatus,
                            text: resText,
                            transformed,
                            entities: newEntities,
                            headers: resHeaders,
                        });
                    });
                });

                break;
            }
            case actionTypes.CANCEL_QUERY: {
                const { queryKey } = action;
                invariant(!!queryKey, 'Missing required `queryKey` field in action handler');

                const state = getState();
                const queries = queriesSelector(state);
                const pendingQueries = getPendingQueries(queries);

                if (queryKey in pendingQueries) {
                    pendingQueries[queryKey].request.abort();
                    returnValue = next(action);
                } else {
                    console.warn('Trying to cancel a request that is not in flight: ', queryKey);
                    returnValue = null;
                }

                break;
            }
            case actionTypes.RESET: {
                const state = getState();
                const queries = queriesSelector(state);
                const pendingQueries = getPendingQueries(queries);

                for (const queryKey in pendingQueries) {
                    if (pendingQueries.hasOwnProperty(queryKey)) {
                        pendingQueries[queryKey].request.abort();
                    }
                }

                returnValue = next(action);

                break;
            }
            default: {
                returnValue = next(action);
            }
        }

        return returnValue;
    };
};

export default queryMiddlewareAdvanced;
