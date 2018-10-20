import * as Actions from '../../src/actions';
import * as ActionTypes from '../../src/constants/action-types';
describe('actions', () => {
  describe('requestStart', () => {
    it('should pass all the fields', () => {
      const payload = {
        url: 'http://localhost',
        body: 'body',
        networkHandler: jest.fn(),
        meta: { foo: 'bar' },
        queryKey: 'queryKey',
      };
      expect(Actions.requestStart(payload)).toMatchObject({
        ...payload,
        type: ActionTypes.REQUEST_START,
      });
    });
  });

  describe('requestSuccess', () => {
    it('should pass all the fields', () => {
      const payload = {
        url: 'http://localhost',
        body: 'body',
        duration: 200,
        status: 200,
        entities: {},
        responseBody: 'body',
        responseText: 'text',
        responseHeaders: { foo: 'bar' },
        meta: { foo: 'bar' },
        queryKey: 'queryKey',
      };
      const action = Actions.requestSuccess(payload);
      expect(action).toMatchObject({
        ...payload,
        type: ActionTypes.REQUEST_SUCCESS,
      });
      expect(typeof action.time).toBe('number');
    });
  });

  describe('requestFailure', () => {
    it('should pass all the fields', () => {
      const payload = {
        url: 'http://localhost',
        body: 'body',
        duration: 200,
        status: 200,
        responseBody: 'body',
        responseText: 'text',
        responseHeaders: { foo: 'bar' },
        meta: { foo: 'bar' },
        queryKey: 'queryKey',
      };
      const action = Actions.requestFailure(payload);
      expect(action).toMatchObject({
        ...payload,
        type: ActionTypes.REQUEST_FAILURE,
      });
      expect(typeof action.time).toBe('number');
    });
  });

  describe('mutateStart', () => {
    it('should pass all the fields', () => {
      const payload = {
        url: 'http://localhost',
        body: 'body',
        networkHandler: jest.fn(),
        optimisticEntities: { foo: jest.fn() },
        meta: { foo: 'bar' },
        queryKey: 'queryKey',
      };
      const action = Actions.mutateStart(payload);
      expect(action).toMatchObject({
        ...payload,
        type: ActionTypes.MUTATE_START,
      });
    });
  });

  describe('mutateSuccess', () => {
    it('should pass all the fields', () => {
      const payload = {
        url: 'http://localhost',
        body: 'body',
        duration: 200,
        status: 200,
        entities: {},
        responseBody: 'body',
        responseText: 'text',
        responseHeaders: { foo: 'bar' },
        meta: { foo: 'bar' },
        queryKey: 'queryKey',
      };
      const action = Actions.mutateSuccess(payload);
      expect(action).toMatchObject({
        ...payload,
        type: ActionTypes.MUTATE_SUCCESS,
      });
      expect(typeof action.time).toBe('number');
    });
  });

  describe('mutateFailure', () => {
    it('should pass all the fields', () => {
      const payload = {
        url: 'http://localhost',
        body: 'body',
        duration: 200,
        status: 200,
        responseBody: 'body',
        responseText: 'text',
        responseHeaders: { foo: 'bar' },
        meta: { foo: 'bar' },
        queryKey: 'queryKey',
      };
      const action = Actions.mutateFailure(payload);
      expect(action).toMatchObject({
        ...payload,
        type: ActionTypes.MUTATE_FAILURE,
      });
      expect(typeof action.time).toBe('number');
    });
  });

  describe('requestAsync', () => {
    it('should pass all the fields', () => {
      const payload = {
        url: 'http://localhost',
        body: 'body',
        force: true,
        queryKey: 'queryKey',
        meta: { foo: 'bar' },
        options: { foo: 'bar' },
        retry: true,
        transform: { foo: jest.fn() },
        update: { foo: jest.fn() },
        unstable_preDispatchCallback: jest.fn(),
      };
      expect(Actions.requestAsync(payload)).toMatchObject({
        ...payload,
        type: ActionTypes.REQUEST_ASYNC,
      });
    });
  });

  describe('mutateAsync', () => {
    it('should pass all the fields', () => {
      const payload = {
        url: 'http://localhost',
        body: 'body',
        queryKey: 'queryKey',
        meta: { foo: 'bar' },
        options: { foo: 'bar' },
        transform: { foo: jest.fn() },
        update: { foo: jest.fn() },
        rollback: { foo: jest.fn() },
        optimisticUpdate: { foo: jest.fn() },
      };
      expect(Actions.mutateAsync(payload)).toMatchObject({
        ...payload,
        type: ActionTypes.MUTATE_ASYNC,
      });
    });
  });

  describe('cancelQuery', () => {
    it('should pass all the fields', () => {
      const payload = 'queryKey';
      expect(Actions.cancelQuery(payload)).toMatchObject({
        queryKey: payload,
        type: ActionTypes.CANCEL_QUERY,
      });
    });
  });

  describe('updateEntities', () => {
    it('should pass all the fields', () => {
      const payload = { foo: jest.fn() };
      expect(Actions.updateEntities(payload)).toMatchObject({
        update: payload,
        type: ActionTypes.UPDATE_ENTITIES,
      });
    });
  });
});
