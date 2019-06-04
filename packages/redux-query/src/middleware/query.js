import Backoff from 'backo';
import invariant from 'invariant';
import get from 'lodash.get';
import identity from 'lodash.identity';
import includes from 'lodash.includes';
import pick from 'lodash.pick';
import pickBy from 'lodash.pickby';

import {
  requestStart,
  requestFailure,
  requestSuccess,
  mutateStart,
  mutateFailure,
  mutateSuccess,
} from '../actions';
import * as actionTypes from '../constants/action-types';
import httpMethods from '../constants/http-methods';
import * as statusCodes from '../constants/status-codes';
import { getQueryKey } from '../lib/query-key';
import { updateEntities, optimisticUpdateEntities, rollbackEntities } from '../lib/update';

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
  getQueryKey,
};

const getPendingQueries = queries => {
  return pickBy(queries, query => query.isPending);
};

const isStatusOK = status => status >= 200 && status < 300;

const queryMiddleware = (networkInterface, queriesSelector, entitiesSelector, customConfig) => {
  return ({ dispatch, getState }) => next => action => {
    let returnValue;
    const { getQueryKey, ...config } = { ...defaultConfig, ...customConfig };
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

        const queryKey = getQueryKey(action);

        const state = getState();
        const queries = queriesSelector(state);

        const queriesState = queries[queryKey];
        const isPending = get(queriesState, ['isPending']);
        const status = get(queriesState, ['status']);
        const hasSucceeded = isStatusOK(status);

        if (force || !queriesState || (retry && !isPending && !hasSucceeded)) {
          returnValue = new Promise(resolve => {
            const start = new Date();
            const { method = httpMethods.GET } = options;
            let attempts = 0;
            const backoff = new Backoff({
              min: config.backoff.minDuration,
              max: config.backoff.maxDuration,
            });

            const attemptRequest = () => {
              const networkHandler = networkInterface(url, method, {
                body,
                headers: options.headers,
                credentials: options.credentials,
              });

              dispatch(
                requestStart({
                  body,
                  meta,
                  networkHandler,
                  queryKey,
                  url,
                }),
              );

              attempts += 1;

              networkHandler.execute((err, status, responseBody, responseText, responseHeaders) => {
                if (
                  includes(config.retryableStatusCodes, status) &&
                  attempts < config.backoff.maxAttempts
                ) {
                  // TODO take into account Retry-After header if 503
                  setTimeout(attemptRequest, backoff.duration());
                  return;
                }

                const end = new Date();
                const duration = end - start;
                let transformed;
                let newEntities;

                if (action.unstable_preDispatchCallback) {
                  action.unstable_preDispatchCallback();
                }

                if (err || !isStatusOK(status)) {
                  dispatch(
                    requestFailure({
                      body,
                      duration,
                      meta,
                      queryKey,
                      responseBody,
                      responseHeaders,
                      status,
                      responseText,
                      url,
                    }),
                  );

                  resolve({
                    body: responseBody,
                    duration,
                    status: status,
                    text: responseText,
                    headers: responseHeaders,
                  });
                } else {
                  const callbackState = getState();
                  const entities = entitiesSelector(callbackState);
                  transformed = transform(responseBody, responseText);
                  newEntities = updateEntities(update, entities, transformed);

                  dispatch(
                    requestSuccess({
                      body,
                      duration,
                      meta,
                      entities: newEntities,
                      queryKey,
                      responseBody,
                      responseHeaders,
                      status,
                      responseText,
                      url,
                    }),
                  );

                  resolve({
                    body: responseBody,
                    duration,
                    status,
                    text: responseText,
                    transformed,
                    entities: newEntities,
                    headers: responseHeaders,
                  });
                }
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

        const queryKey = getQueryKey(action);

        returnValue = new Promise(resolve => {
          const start = new Date();
          const { method = httpMethods.POST } = options;

          const networkHandler = networkInterface(url, method, {
            body,
            headers: options.headers,
            credentials: options.credentials,
          });

          // Note: only the entities that are included in `optimisticUpdate` will be passed along in the
          // `mutateStart` action as `optimisticEntities`
          dispatch(
            mutateStart({
              body,
              meta,
              networkHandler,
              optimisticEntities,
              queryKey,
              url,
            }),
          );

          networkHandler.execute((err, status, responseBody, responseText, responseHeaders) => {
            const end = new Date();
            const duration = end - start;
            const state = getState();
            const entities = entitiesSelector(state);
            let transformed;
            let newEntities;

            if (err || !isStatusOK(status)) {
              let rolledBackEntities;

              if (optimisticUpdate) {
                rolledBackEntities = rollbackEntities(
                  rollback,
                  pick(initialEntities, Object.keys(optimisticEntities)),
                  pick(entities, Object.keys(optimisticEntities)),
                );
              }

              dispatch(
                mutateFailure({
                  body,
                  duration,
                  meta,
                  queryKey,
                  responseBody,
                  responseHeaders,
                  status,
                  responseText,
                  rolledBackEntities,
                  url,
                }),
              );

              resolve({
                body: responseBody,
                duration,
                status,
                text: responseText,
                headers: responseHeaders,
              });
            } else {
              transformed = transform(responseBody, responseText);
              newEntities = updateEntities(update, entities, transformed);

              dispatch(
                mutateSuccess({
                  url,
                  body,
                  duration,
                  status,
                  entities: newEntities,
                  queryKey,
                  responseBody,
                  responseText,
                  responseHeaders,
                  meta,
                }),
              );

              resolve({
                body: responseBody,
                duration,
                status,
                text: responseText,
                transformed,
                entities: newEntities,
                headers: responseHeaders,
              });
            }
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
          pendingQueries[queryKey].networkHandler.abort();
          returnValue = next(action);
        } else {
          // eslint-disable-next-line
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
            pendingQueries[queryKey].networkHandler.abort();
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

export default queryMiddleware;
