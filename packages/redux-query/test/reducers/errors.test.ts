import * as actionTypes from '../../src/constants/action-types';
import errors from '../../src/reducers/errors';

describe('errors reducer', () => {
  test('should record body, text, headers on REQUEST_FAILURE', () => {
    const action = {
      type: actionTypes.REQUEST_FAILURE,
      queryKey: '{"url":"/hello"}',
      responseBody: {
        error: 'please stop',
      },
      responseText: '{"error":"please stop"}',
      responseHeaders: {
        hello: 'world',
      },
    };
    const prevState = {
      '{"url":"/test"}': {
        responseBody: {
          test: 'a',
        },
        responseText: '{"test":"a"}',
        responseHeaders: {},
      },
    };
    // @ts-ignore
    const newState = errors(prevState, action);
    const expectedState = {
      '{"url":"/hello"}': {
        responseBody: {
          error: 'please stop',
        },
        responseText: '{"error":"please stop"}',
        responseHeaders: {
          hello: 'world',
        },
      },
      '{"url":"/test"}': {
        responseBody: {
          test: 'a',
        },
        responseText: '{"test":"a"}',
        responseHeaders: {},
      },
    };
    expect(newState).toEqual(expectedState);
  });

  test('should record body, text, headers on MUTATE_FAILURE', () => {
    const action = {
      type: actionTypes.MUTATE_FAILURE,
      queryKey: '{"url":"/change-name","body":{"name":"Ryan"}}',
      responseBody: {
        error: 'invalid name',
      },
      responseText: '{"error":"invalid name"}',
      responseHeaders: {},
    };
    const prevState = {
      '{"url":"/test"}': {
        responseBody: {
          test: 'a',
        },
        responseText: '{"test":"a"}',
        responseHeaders: {},
      },
    };
    // @ts-ignore
    const newState = errors(prevState, action);
    const expectedState = {
      '{"url":"/test"}': {
        responseBody: {
          test: 'a',
        },
        responseText: '{"test":"a"}',
        responseHeaders: {},
      },
      '{"url":"/change-name","body":{"name":"Ryan"}}': {
        responseBody: {
          error: 'invalid name',
        },
        responseText: '{"error":"invalid name"}',
        responseHeaders: {},
      },
    };
    expect(newState).toEqual(expectedState);
  });

  test('should remove state for query on REQUEST_START', () => {
    const action = {
      type: actionTypes.REQUEST_START,
      queryKey: '{"url":"/hello"}',
    };
    const prevState = {
      '{"url":"/test"}': {
        responseBody: {
          test: 'a',
        },
        responseText: '{"test":"a"}',
        responseHeaders: {},
      },
      '{"url":"/hello"}': {
        responseBody: {
          hello: 'world!',
        },
        responseText: '{"hello":"world"}',
        responseHeaders: {
          hello: 'world',
        },
      },
    };
    // @ts-ignore
    const newState = errors(prevState, action);
    const expectedState = {
      '{"url":"/test"}': {
        responseBody: {
          test: 'a',
        },
        responseText: '{"test":"a"}',
        responseHeaders: {},
      },
    };
    expect(newState).toEqual(expectedState);
  });

  test('should remove state for query on MUTATE_START', () => {
    const action = {
      type: actionTypes.MUTATE_START,
      queryKey: '{"url":"/change-name","body":{"name":"Ryan"}}',
    };
    const prevState = {
      '{"url":"/test"}': {
        responseBody: {
          test: 'a',
        },
        responseText: '{"test":"a"}',
        responseHeaders: {},
      },
      '{"url":"/change-name","body":{"name":"Ryan"}}': {
        responseBody: {
          error: 'invalid name',
        },
        responseText: '{"error":"invalid name"}',
        responseHeaders: {},
      },
    };
    // @ts-ignore
    const newState = errors(prevState, action);
    const expectedState = {
      '{"url":"/test"}': {
        responseBody: {
          test: 'a',
        },
        responseText: '{"test":"a"}',
        responseHeaders: {},
      },
    };
    expect(newState).toEqual(expectedState);
  });

  test('should handle RESET', () => {
    const action = {
      type: actionTypes.RESET,
    };
    const prevState = {
      '{"url":"/hello"}': {
        responseBody: {
          hello: 'world!',
        },
        responseText: '{"hello":"world"}',
        responseHeaders: {
          hello: 'world',
        },
      },
    };
    // @ts-ignore
    const newState = errors(prevState, action);
    const expectedState = {};
    expect(newState).toEqual(expectedState);
  });
});
