import * as actionTypes from '../../src/constants/action-types';
import { getQueryKey } from '../../src/lib/query-key';
import queryMiddleware from '../../src/middleware/query';

const apiMessage = 'hello, world!';

const mockNetworkInterface = (url, method, options) => {
  return {
    abort() {
      // no op
    },
    execute(callback) {
      if (url === '/echo-headers') {
        setTimeout(() => {
          const status = 200;
          const body = {
            message: options.headers,
          };
          const text = JSON.stringify(body);
          const headers = {};

          callback(null, status, body, text, headers);
        }, 0);
      } else if (url === '/api') {
        setTimeout(() => {
          const status = 200;
          const body = {
            message: apiMessage,
          };
          const text = JSON.stringify(body);
          const headers = {};

          callback(null, status, body, text, headers);
        }, 0);
      } else {
        setTimeout(() => {
          callback(null, 404, {}, '{}', {});
        }, 0);
      }
    },
  };
};

const mockDispatchToAssertActions = (actionsToDispatch, done) => {
  let actionsLeft = actionsToDispatch;

  return action => {
    // Don't do a deep equal, just check type, url, and status fields
    Object.keys(actionsLeft[0]).forEach(keyToCheck => {
      expect(action[keyToCheck]).toEqual(actionsLeft[0][keyToCheck]);
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

    beforeAll(() => {
      const queriesSelector = state => state.queries;
      const entitiesSelector = state => state.entities;
      const dispatch = () => {};
      const getState = () => {};
      nextHandler = queryMiddleware(mockNetworkInterface, queriesSelector, entitiesSelector)({
        dispatch,
        getState,
      });
    });

    test('must return a next handler', () => {
      expect(typeof nextHandler).toBe('function');
    });

    test('must return a next handler that returns an action handler', () => {
      const actionHandler = nextHandler();
      expect(typeof actionHandler).toBe('function');
    });

    test('must pass action to `next` if not a redux-query action', done => {
      const actionObj = {};

      const actionHandler = nextHandler(action => {
        expect(action).toBe(actionObj);
        done();
      });

      actionHandler(actionObj);
    });
  });

  describe('must handle requests', () => {
    const queriesSelector = state => state.queries;
    const entitiesSelector = state => state.entities;

    test('by dispatching start and success actions', done => {
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
      const nextHandler = queryMiddleware(mockNetworkInterface, queriesSelector, entitiesSelector)({
        dispatch,
        getState,
      });
      const actionHandler = nextHandler();
      actionHandler({
        type: actionTypes.REQUEST_ASYNC,
        url,
        update: {
          message: (prevMessage, message) => message,
        },
      });
    });

    test('should use query key if provided', done => {
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
      const nextHandler = queryMiddleware(mockNetworkInterface, queriesSelector, entitiesSelector)({
        dispatch,
        getState,
      });
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

    test('should use headers if provided as an option', done => {
      const url = '/echo-headers';
      const headers = { 'x-message': apiMessage };
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
            message: headers,
          },
        },
      ];
      const dispatch = mockDispatchToAssertActions(actionsToDispatch, done);
      const getState = () => ({
        entities: {},
        queries: {},
      });
      const nextHandler = queryMiddleware(mockNetworkInterface, queriesSelector, entitiesSelector)({
        dispatch,
        getState,
      });
      const actionHandler = nextHandler();
      actionHandler({
        type: actionTypes.REQUEST_ASYNC,
        url,
        options: {
          headers,
        },
        update: {
          message: (prevMessage, message) => message,
        },
      });
    });

    test('should not fetch if request by same URL has been made', () => {
      const url = '/api';
      const dispatch = () => {
        expect(false).toBe(true);
      };
      const queryKey = getQueryKey({ url });
      const getState = () => ({
        entities: {},
        queries: {
          [queryKey]: {
            isPending: false,
          },
        },
      });
      const nextHandler = queryMiddleware(mockNetworkInterface, queriesSelector, entitiesSelector)({
        dispatch,
        getState,
      });
      const actionHandler = nextHandler();
      const requestAction = actionHandler({
        type: actionTypes.REQUEST_ASYNC,
        url,
        update: {
          message: (prevMessage, message) => message,
        },
      });

      expect(requestAction).not.toBeDefined();
    });

    test('should not fetch if request by same URL is pending even with `retry`', () => {
      const url = '/api';
      const dispatch = () => {
        expect(false).toBe(true);
      };
      const queryKey = getQueryKey({ url });
      const getState = () => ({
        entities: {},
        queries: {
          [queryKey]: {
            isPending: true,
            status: 500,
          },
        },
      });
      const nextHandler = queryMiddleware(mockNetworkInterface, queriesSelector, entitiesSelector)({
        dispatch,
        getState,
      });
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

    test('should fetch with `retry` if request by same URL is not pending and has not succeeded', done => {
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
      const queryKey = getQueryKey({ url });
      const getState = () => ({
        entities: {},
        queries: {
          [queryKey]: {
            isPending: false,
            status: 500,
          },
        },
      });
      const nextHandler = queryMiddleware(mockNetworkInterface, queriesSelector, entitiesSelector)({
        dispatch,
        getState,
      });
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

    test('should fetch with `force` even though request by same URL has succeeded', done => {
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
      const queryKey = getQueryKey({ url });
      const getState = () => ({
        entities: {},
        queries: {
          [queryKey]: {
            isPending: false,
            status: 200,
          },
        },
      });
      const nextHandler = queryMiddleware(mockNetworkInterface, queriesSelector, entitiesSelector)({
        dispatch,
        getState,
      });
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
    const queriesSelector = state => state.queries;
    const entitiesSelector = state => state.entities;

    test('by dispatching start and success actions', done => {
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
      const nextHandler = queryMiddleware(mockNetworkInterface, queriesSelector, entitiesSelector)({
        dispatch,
        getState,
      });
      const actionHandler = nextHandler();
      actionHandler({
        type: actionTypes.MUTATE_ASYNC,
        url,
        update: {
          message: (prevMessage, message) => message,
        },
      });
    });

    test('should use query key if provided', done => {
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
      const nextHandler = queryMiddleware(mockNetworkInterface, queriesSelector, entitiesSelector)({
        dispatch,
        getState,
      });
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

    test('should use headers if provided as an option', done => {
      const url = '/echo-headers';
      const headers = { 'x-message': apiMessage };
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
            message: headers,
          },
        },
      ];
      const dispatch = mockDispatchToAssertActions(actionsToDispatch, done);
      const getState = () => ({
        entities: {},
        queries: {},
      });
      const nextHandler = queryMiddleware(mockNetworkInterface, queriesSelector, entitiesSelector)({
        dispatch,
        getState,
      });
      const actionHandler = nextHandler();
      actionHandler({
        type: actionTypes.MUTATE_ASYNC,
        url,
        options: {
          headers,
        },
        update: {
          message: (prevMessage, message) => message,
        },
      });
    });

    test('by supporting optimistic updates', done => {
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
      const nextHandler = queryMiddleware(mockNetworkInterface, queriesSelector, entitiesSelector)({
        dispatch,
        getState,
      });
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

    test('by reverting optimistic updates in case of failure', done => {
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
          rolledBackEntities: {
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
      const nextHandler = queryMiddleware(mockNetworkInterface, queriesSelector, entitiesSelector)({
        dispatch,
        getState,
      });
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

    test('by reverting optimistic updates with rollback in case of failure', done => {
      const url = '/message/hello/update';
      const actionsToDispatch = [
        {
          type: actionTypes.MUTATE_START,
          url,
          optimisticEntities: {
            messagesById: {
              hello: 'world',
            },
          },
        },
        {
          type: actionTypes.MUTATE_FAILURE,
          url,
          status: 404,
          rolledBackEntities: {
            messagesById: {
              hello: null,
            },
          },
        },
      ];
      const dispatch = mockDispatchToAssertActions(actionsToDispatch, done);
      const getState = () => ({
        entities: {
          messagesById: {
            hello: null,
          },
        },
        queries: {},
      });
      const nextHandler = queryMiddleware(mockNetworkInterface, queriesSelector, entitiesSelector)({
        dispatch,
        getState,
      });
      const actionHandler = nextHandler();
      actionHandler({
        type: actionTypes.MUTATE_ASYNC,
        url,
        optimisticUpdate: {
          messagesById: messagesById => ({
            ...messagesById,
            hello: 'world',
          }),
        },
        update: {
          messagesById: (prevMessagesById, messagesById) => ({
            ...messagesById,
            hello: messagesById.hello,
          }),
        },
        rollback: {
          messagesById: (originalMessagesById, currentMessagesById) => ({
            ...currentMessagesById,
            hello: originalMessagesById.hello,
          }),
        },
      });
    });
  });

  describe('must handle cancelations', () => {
    const queriesSelector = state => state.queries;
    const entitiesSelector = state => state.entities;

    test('by canceling pending request', done => {
      const url = '/api';
      const dispatch = () => {
        expect(false).toBe(true);
      };
      const mockRequestObject = {
        abort: () => {
          done();
        },
      };
      const queryKey = getQueryKey({ url });
      const getState = () => ({
        entities: {},
        queries: {
          [queryKey]: {
            isPending: true,
            networkHandler: mockRequestObject,
          },
        },
      });
      const next = () => {};
      const nextHandler = queryMiddleware(mockNetworkInterface, queriesSelector, entitiesSelector)({
        dispatch,
        getState,
      });
      const actionHandler = nextHandler(next);
      actionHandler({
        type: actionTypes.CANCEL_QUERY,
        queryKey,
      });
    });

    test('by canceling pending mutation', done => {
      const url = '/api';
      const dispatch = () => {
        expect(false).toBe(true);
      };
      const mockRequestObject = {
        abort: () => {
          done();
        },
      };
      const queryKey = getQueryKey({ url });
      const getState = () => ({
        entities: {},
        queries: {
          [queryKey]: {
            isPending: true,
            isMutation: true,
            networkHandler: mockRequestObject,
          },
        },
      });
      const next = () => {};
      const nextHandler = queryMiddleware(mockNetworkInterface, queriesSelector, entitiesSelector)({
        dispatch,
        getState,
      });
      const actionHandler = nextHandler(next);
      actionHandler({
        type: actionTypes.CANCEL_QUERY,
        queryKey,
      });
    });
  });

  describe('must handle being reset', () => {
    const queriesSelector = state => state.queries;
    const entitiesSelector = state => state.entities;

    test('by canceling all pending queries', done => {
      const dispatch = () => {
        expect(false).toBe(true);
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
            networkHandler: mockRequestObject,
          },
          '/api2': {
            isPending: true,
            networkHandler: mockRequestObject,
          },
        },
      });
      const nextHandler = queryMiddleware(mockNetworkInterface, queriesSelector, entitiesSelector)({
        dispatch,
        getState,
      });
      const actionHandler = nextHandler(next);
      actionHandler({
        type: actionTypes.RESET,
      });
    });
  });
});
