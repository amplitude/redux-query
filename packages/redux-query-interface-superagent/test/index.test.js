import superagent from 'superagent';
import superagentMock from 'superagent-mock';
import HttpMethods from 'redux-query/src/constants/http-methods';

import superagentInterface from '../src';

const mockEndpoint = requestHttpMethod => () => {
  return {
    text: requestHttpMethod,
    status: 200,
    ok: true,
  };
};

const superagentMockConfig = [
  {
    pattern: '/echo-headers',
    fixtures: (match, params, headers) => {
      const filteredHeaders = { ...headers };
      delete filteredHeaders['User-Agent'];

      return filteredHeaders;
    },
    get: (match, data) => {
      return {
        body: {
          headers: data,
        },
        status: 200,
        ok: true,
      };
    },
  },
  {
    pattern: '/api',
    fixtures: () => {},
    delete: mockEndpoint(HttpMethods.DELETE),
    get: mockEndpoint(HttpMethods.GET),
    head: mockEndpoint(HttpMethods.HEAD),
    patch: mockEndpoint(HttpMethods.PATCH),
    post: mockEndpoint(HttpMethods.POST),
    put: mockEndpoint(HttpMethods.PUT),
  },
];

superagentMock(superagent, superagentMockConfig);

describe('superagent interface', () => {
  test('returns an object with both execute and abort functions, as well as the request instance', () => {
    const networkInterface = superagentInterface('/api', HttpMethods.GET);
    expect(typeof networkInterface.execute).toBe('function');
    expect(typeof networkInterface.abort).toBe('function');
  });

  test('returns a DELETE request when supplied a HEAD method', () => {
    const { execute } = superagentInterface('/api', HttpMethods.DELETE);

    execute((err, status, body, text) => {
      expect(status).toEqual(200);
      expect(text).toEqual(HttpMethods.DELETE);
    });
  });

  test('returns a GET request when supplied a GET method', () => {
    const { execute } = superagentInterface('/api', HttpMethods.GET);

    execute((err, status, body, text) => {
      expect(status).toEqual(200);
      expect(text).toEqual(HttpMethods.GET);
    });
  });

  test('returns a HEAD request when supplied a HEAD method', () => {
    const { execute } = superagentInterface('/api', HttpMethods.HEAD);

    execute((err, status, body, text) => {
      expect(status).toEqual(200);
      expect(text).toEqual(HttpMethods.HEAD);
    });
  });

  test('returns a PATCH request when supplied a PATCH method', () => {
    const { execute } = superagentInterface('/api', HttpMethods.PATCH);

    execute((err, status, body, text) => {
      expect(status).toEqual(200);
      expect(text).toEqual(HttpMethods.PATCH);
    });
  });

  test('returns a POST request when supplied a POST method', () => {
    const { execute } = superagentInterface('/api', HttpMethods.POST);

    execute((err, status, body, text) => {
      expect(status).toEqual(200);
      expect(text).toEqual(HttpMethods.POST);
    });
  });

  test('returns a PUT request when supplied a PUT method', () => {
    const { execute } = superagentInterface('/api', HttpMethods.PUT);

    execute((err, status, body, text) => {
      expect(status).toEqual(200);
      expect(text).toEqual(HttpMethods.PUT);
    });
  });

  test('throws an error when supplied an invalid HTTP method', () => {
    const invalid = () => superagentInterface('/api', 'foo');
    expect(invalid).toThrow();
  });

  test('includes headers when headers are provided', () => {
    const { execute } = superagentInterface('/echo-headers', HttpMethods.GET, {
      headers: {
        'X-Org': 21,
      },
    });

    execute((err, status, body) => {
      expect(status).toEqual(200);
      expect(body.headers).toEqual({
        'X-Org': 21,
      });
    });
  });
});
