import { assert } from 'chai';
import superagent from 'superagent';
import superagentMock from 'superagent-mock';

import * as actionTypes from '../../src/constants/action-types';
import getQueryKey from '../../src/lib/get-query-key';
import queryMiddleware from '../../src/middleware/query';

const apiMessage = 'hello, world!';
const mockEndpoint = (match, data) => {
    switch (match[0]) {
        case '/api': {
            return {
                body: {
                    message: data,
                },
                status: 200,
                ok: true,
            };
        }
        
        default: {
            return {
                body: {},
                status: 404,
                ok: false,
            };
        }
    }
};
const superagentMockConfig = [
    {
        pattern: '/echo-headers',
        fixtures: (match, params, headers, context) => {
            return headers;
        },
        get: (match, data) => {
            return {
                body: {
                    message: data
                },
                status: 200,
                ok: true
            }
        }
    },
    {
        pattern: '/(\\w+)',
        fixtures: (match, params, headers, context) => {
            return apiMessage;
        },
        get: mockEndpoint,
        post: mockEndpoint,
    },
];

superagentMock(superagent, superagentMockConfig);

const mockDispatchToAssertActions = (actionsToDispatch, done) => {
    let actionsLeft = actionsToDispatch;

    return (action) => {
        // Don't do a deep equal, just check type, url, and status fields
        Object.keys(actionsLeft[0]).forEach((keyToCheck) => {
            assert.deepEqual(action[keyToCheck], actionsLeft[0][keyToCheck]);
        });

        // Dequeue actions we expect to be dispatched
        actionsLeft = actionsLeft.slice(1);

        // If we have dispatched all actions, end the test
        if (actionsLeft.length === 0) {
            done();
        }
    };
};

describe('query middleware', () => {
    describe('should have middleware semantics', () => {
        let nextHandler;

        before(() => {
            const queriesSelector = (state) => state.queries;
            const entitiesSelector = (state) => state.entities;
            const dispatch = () => {};
            const getState = () => {};
            nextHandler = queryMiddleware(queriesSelector, entitiesSelector)({ dispatch, getState });
        });

        it('must return a next handler', () => {
            assert.isFunction(nextHandler);
        });

        it('must return a next handler that returns an action handler', () => {
            const actionHandler = nextHandler();
            assert.isFunction(actionHandler);
        });

        it('must pass action to `next` if not a redux-query action', (done) => {
            const actionObj = {};

            const actionHandler = nextHandler((action) => {
                assert.strictEqual(action, actionObj);
                done();
            });

            actionHandler(actionObj);
        });
    });

    describe('must handle requests', () => {
        const queriesSelector = (state) => state.queries;
        const entitiesSelector = (state) => state.entities;

        it('by dispatching start and success actions', (done) => {
            const url = '/api';
            const actionsToDispatch = [
                {
                    type: actionTypes.REQUEST_START,
                    url,
                },
                {
                    type: actionTypes.REQUEST_SUCCESS,
                    url,
                    status: 200,
                    entities: {
                        message: apiMessage,
                    },
                },
            ];
            const dispatch = mockDispatchToAssertActions(actionsToDispatch, done);
            const getState = () => ({
                entities: {},
                queries: {},
            });
            const nextHandler = queryMiddleware(queriesSelector, entitiesSelector)({ dispatch, getState });
            const actionHandler = nextHandler();
            actionHandler({
                type: actionTypes.REQUEST_ASYNC,
                url,
                update: {
                    message: (prevMessage, message) => message,
                },
            });
        });

        it('should use query key if provided', (done) => {
            const url = '/api';
            const queryKey = '@specialSnowflake';
            const actionsToDispatch = [
                {
                    type: actionTypes.REQUEST_START,
                    url,
                    queryKey,
                },
                {
                    type: actionTypes.REQUEST_SUCCESS,
                    url,
                    queryKey,
                    status: 200,
                    entities: {
                        message: apiMessage,
                    },
                },
            ];
            const dispatch = mockDispatchToAssertActions(actionsToDispatch, done);
            const getState = () => ({
                entities: {},
                queries: {},
            });
            const nextHandler = queryMiddleware(queriesSelector, entitiesSelector)({ dispatch, getState });
            const actionHandler = nextHandler();
            actionHandler({
                type: actionTypes.REQUEST_ASYNC,
                queryKey,
                url,
                update: {
                    message: (prevMessage, message) => message,
                },
            });
        });
        
        it('should use headers if provided as an option', (done) => {
            const url = '/echo-headers';
            const headers = {"x-message": apiMessage};
            const actionsToDispatch = [
                {
                    type: actionTypes.REQUEST_START,
                    url
                },
                {
                    type: actionTypes.REQUEST_SUCCESS,
                    url,
                    status: 200,
                    entities: {
                        message: headers,
                    },
                },
            ];
            const dispatch = mockDispatchToAssertActions(actionsToDispatch, done);
            const getState = () => ({
                entities: {},
                queries: {},
            });
            const nextHandler = queryMiddleware(queriesSelector, entitiesSelector)({ dispatch, getState });
            const actionHandler = nextHandler();
            actionHandler({
                type: actionTypes.REQUEST_ASYNC,
                url,
                options: {
                    headers
                },
                update: {
                    message: (prevMessage, message) => message,
                },
            });
        });
        
        it('should not fetch if request by same URL has been made', () => {
            const url = '/api';
            const dispatch = () => {
                assert.fail();
            };
            const queryKey = getQueryKey(url);
            const getState = () => ({
                entities: {},
                queries: {
                    [queryKey]: {
                        isPending: false,
                    },
                },
            });
            const nextHandler = queryMiddleware(queriesSelector, entitiesSelector)({ dispatch, getState });
            const actionHandler = nextHandler();
            const requestAction = actionHandler({
                type: actionTypes.REQUEST_ASYNC,
                url,
                update: {
                    message: (prevMessage, message) => message,
                },
            });

            assert.isUndefined(requestAction);
        });

        it('should not fetch if request by same URL is pending even with `retry`', () => {
            const url = '/api';
            const dispatch = () => {
                assert.fail();
            };
            const queryKey = getQueryKey(url);
            const getState = () => ({
                entities: {},
                queries: {
                    [queryKey]: {
                        isPending: true,
                        status: 500,
                    },
                },
            });
            const nextHandler = queryMiddleware(queriesSelector, entitiesSelector)({ dispatch, getState });
            const actionHandler = nextHandler();
            actionHandler({
                type: actionTypes.REQUEST_ASYNC,
                url,
                update: {
                    message: (prevMessage, message) => message,
                },
                retry: true,
            });
        });

        it('should fetch with `retry` if request by same URL is not pending and has not succeeded', (done) => {
            const url = '/api';
            const actionsToDispatch = [
                {
                    type: actionTypes.REQUEST_START,
                    url,
                },
                {
                    type: actionTypes.REQUEST_SUCCESS,
                    url,
                    status: 200,
                    entities: {
                        message: apiMessage,
                    },
                },
            ];
            const dispatch = mockDispatchToAssertActions(actionsToDispatch, done);
            const queryKey = getQueryKey(url);
            const getState = () => ({
                entities: {},
                queries: {
                    [queryKey]: {
                        isPending: false,
                        status: 500,
                    },
                },
            });
            const nextHandler = queryMiddleware(queriesSelector, entitiesSelector)({ dispatch, getState });
            const actionHandler = nextHandler();
            actionHandler({
                type: actionTypes.REQUEST_ASYNC,
                url,
                update: {
                    message: (prevMessage, message) => message,
                },
                retry: true,
            });
        });

        it('should fetch with `force` even though request by same URL has succeeded', (done) => {
            const url = '/api';
            const actionsToDispatch = [
                {
                    type: actionTypes.REQUEST_START,
                    url,
                },
                {
                    type: actionTypes.REQUEST_SUCCESS,
                    url,
                    status: 200,
                    entities: {
                        message: apiMessage,
                    },
                },
            ];
            const dispatch = mockDispatchToAssertActions(actionsToDispatch, done);
            const queryKey = getQueryKey(url);
            const getState = () => ({
                entities: {},
                queries: {
                    [queryKey]: {
                        isPending: false,
                        status: 200,
                    },
                },
            });
            const nextHandler = queryMiddleware(queriesSelector, entitiesSelector)({ dispatch, getState });
            const actionHandler = nextHandler();
            actionHandler({
                type: actionTypes.REQUEST_ASYNC,
                url,
                update: {
                    message: (prevMessage, message) => message,
                },
                force: true,
            });
        });
    });

    describe('must handle mutations', () => {
        const queriesSelector = (state) => state.queries;
        const entitiesSelector = (state) => state.entities;

        it('by dispatching start and success actions', (done) => {
            const url = '/api';
            const actionsToDispatch = [
                {
                    type: actionTypes.MUTATE_START,
                    url,
                },
                {
                    type: actionTypes.MUTATE_SUCCESS,
                    url,
                    status: 200,
                    entities: {
                        message: apiMessage,
                    },
                },
            ];
            const dispatch = mockDispatchToAssertActions(actionsToDispatch, done);
            const getState = () => ({
                entities: {},
                queries: {},
            });
            const nextHandler = queryMiddleware(queriesSelector, entitiesSelector)({ dispatch, getState });
            const actionHandler = nextHandler();
            actionHandler({
                type: actionTypes.MUTATE_ASYNC,
                url,
                update: {
                    message: (prevMessage, message) => message,
                },
            });
        });

        it('should use query key if provided', (done) => {
            const url = '/api';
            const queryKey = '@specialHailChunk';
            const actionsToDispatch = [
                {
                    type: actionTypes.MUTATE_START,
                    queryKey,
                    url,
                },
                {
                    type: actionTypes.MUTATE_SUCCESS,
                    queryKey,
                    url,
                    status: 200,
                    entities: {
                        message: apiMessage,
                    },
                },
            ];
            const dispatch = mockDispatchToAssertActions(actionsToDispatch, done);
            const getState = () => ({
                entities: {},
                queries: {},
            });
            const nextHandler = queryMiddleware(queriesSelector, entitiesSelector)({ dispatch, getState });
            const actionHandler = nextHandler();
            actionHandler({
                type: actionTypes.MUTATE_ASYNC,
                queryKey,
                url,
                update: {
                    message: (prevMessage, message) => message,
                },
            });
        });

        it('by supporting optimistic updates', (done) => {
            const url = '/api';
            const optimisticMessage = 'hello, optimistic world!';
            const actionsToDispatch = [
                {
                    type: actionTypes.MUTATE_START,
                    url,
                    optimisticEntities: {
                        message: optimisticMessage,
                    },
                },
                {
                    type: actionTypes.MUTATE_SUCCESS,
                    url,
                    status: 200,
                    entities: {
                        message: apiMessage,
                    },
                },
            ];
            const dispatch = mockDispatchToAssertActions(actionsToDispatch, done);
            const getState = () => ({
                entities: {
                    message: apiMessage,
                },
                queries: {},
            });
            const nextHandler = queryMiddleware(queriesSelector, entitiesSelector)({ dispatch, getState });
            const actionHandler = nextHandler();
            actionHandler({
                type: actionTypes.MUTATE_ASYNC,
                url,
                optimisticUpdate: {
                    message: () => optimisticMessage,
                },
                update: {
                    message: (prevMessage, message) => message,
                },
            });
        });

        it('by reverting optimistic updates in case of failure', (done) => {
            const url = '/bad-url';
            const optimisticMessage = 'hello, optimistic world!';
            const actionsToDispatch = [
                {
                    type: actionTypes.MUTATE_START,
                    url,
                    optimisticEntities: {
                        message: optimisticMessage,
                    },
                },
                {
                    type: actionTypes.MUTATE_FAILURE,
                    url,
                    status: 404,
                    originalEntities: {
                        message: apiMessage,
                    },
                },
            ];
            const dispatch = mockDispatchToAssertActions(actionsToDispatch, done);
            const getState = () => ({
                entities: {
                    message: apiMessage,
                },
                queries: {},
            });
            const nextHandler = queryMiddleware(queriesSelector, entitiesSelector)({ dispatch, getState });
            const actionHandler = nextHandler();
            actionHandler({
                type: actionTypes.MUTATE_ASYNC,
                url,
                optimisticUpdate: {
                    message: () => optimisticMessage,
                },
                update: {
                    message: (prevMessage, message) => message,
                },
            });
        });
    });

    describe('must handle cancelations', () => {
        const queriesSelector = (state) => state.queries;
        const entitiesSelector = (state) => state.entities;

        it('by canceling pending request', (done) => {
            const url = '/api';
            const dispatch = () => {
                assert.fail();
            };
            const mockRequestObject = {
                abort: () => {
                    done();
                },
            };
            const queryKey = getQueryKey(url);
            const getState = () => ({
                entities: {},
                queries: {
                    [queryKey]: {
                        isPending: true,
                        request: mockRequestObject,
                    },
                },
            });
            const next = () => {};
            const nextHandler = queryMiddleware(queriesSelector, entitiesSelector)({ dispatch, getState });
            const actionHandler = nextHandler(next);
            actionHandler({
                type: actionTypes.CANCEL_QUERY,
                queryKey,
            });
        });

        it('by canceling pending mutation', (done) => {
            const url = '/api';
            const dispatch = () => {
                assert.fail();
            };
            const mockRequestObject = {
                abort: () => {
                    done();
                },
            };
            const queryKey = getQueryKey(url);
            const getState = () => ({
                entities: {},
                queries: {
                    [queryKey]: {
                        isPending: true,
                        isMutation: true,
                        request: mockRequestObject,
                    },
                },
            });
            const next = () => {};
            const nextHandler = queryMiddleware(queriesSelector, entitiesSelector)({ dispatch, getState });
            const actionHandler = nextHandler(next);
            actionHandler({
                type: actionTypes.CANCEL_QUERY,
                queryKey,
            });
        });
    });

    describe('must handle being reset', () => {
        const queriesSelector = (state) => state.queries;
        const entitiesSelector = (state) => state.entities;

        it('by canceling all pending queries', (done) => {
            const dispatch = () => {
                assert.fail();
            };
            const next = () => {};
            let queriesLeft = 2;
            const mockRequestObject = {
                abort: () => {
                    queriesLeft -= 1;
                    if (queriesLeft === 0) {
                        done();
                    }
                },
            };
            const getState = () => ({
                entities: {},
                queries: {
                    '/api1': {
                        isPending: true,
                        request: mockRequestObject,
                    },
                    '/api2': {
                        isPending: true,
                        request: mockRequestObject,
                    },
                },
            });
            const nextHandler = queryMiddleware(queriesSelector, entitiesSelector)({ dispatch, getState });
            const actionHandler = nextHandler(next);
            actionHandler({
                type: actionTypes.RESET,
            });
        });
    });
});
