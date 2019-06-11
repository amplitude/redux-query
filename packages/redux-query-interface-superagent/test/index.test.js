import superagent from 'superagent';
import superagentMock from 'superagent-mock';
import httpMethods from 'redux-query/src/constants/http-methods';

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
    delete: mockEndpoint(httpMethods.DELETE),
    get: mockEndpoint(httpMethods.GET),
    head: mockEndpoint(httpMethods.HEAD),
    patch: mockEndpoint(httpMethods.PATCH),
    post: mockEndpoint(httpMethods.POST),
    put: mockEndpoint(httpMethods.PUT),
  },
];

superagentMock(superagent, superagentMockConfig);

describe('superagent interface', () => {
  test('returns an object with both execute and abort functions, as well as the request instance', () => {
    const networkInterface = superagentInterface('/api', httpMethods.GET);
    expect(typeof networkInterface.execute).toBe('function');
    expect(typeof networkInterface.abort).toBe('function');
  });

  test('returns a DELETE request when supplied a HEAD method', () => {
    const { execute } = superagentInterface('/api', httpMethods.DELETE);

    execute((err, status, body, text) => {
      expect(status).toEqual(200);
      expect(text).toEqual(httpMethods.DELETE);
    });
  });

  test('returns a GET request when supplied a GET method', () => {
    const { execute } = superagentInterface('/api', httpMethods.GET);

    execute((err, status, body, text) => {
      expect(status).toEqual(200);
      expect(text).toEqual(httpMethods.GET);
    });
  });

  test('returns a HEAD request when supplied a HEAD method', () => {
    const { execute } = superagentInterface('/api', httpMethods.HEAD);

    execute((err, status, body, text) => {
      expect(status).toEqual(200);
      expect(text).toEqual(httpMethods.HEAD);
    });
  });

  test('returns a PATCH request when supplied a PATCH method', () => {
    const { execute } = superagentInterface('/api', httpMethods.PATCH);

    execute((err, status, body, text) => {
      expect(status).toEqual(200);
      expect(text).toEqual(httpMethods.PATCH);
    });
  });

  test('returns a POST request when supplied a POST method', () => {
    const { execute } = superagentInterface('/api', httpMethods.POST);

    execute((err, status, body, text) => {
      expect(status).toEqual(200);
      expect(text).toEqual(httpMethods.POST);
    });
  });

  test('returns a PUT request when supplied a PUT method', () => {
    const { execute } = superagentInterface('/api', httpMethods.PUT);

    execute((err, status, body, text) => {
      expect(status).toEqual(200);
      expect(text).toEqual(httpMethods.PUT);
    });
  });

  test('throws an error when supplied an invalid HTTP method', () => {
    const invalid = () => superagentInterface('/api', 'foo');
    expect(invalid).toThrow();
  });

  test('includes headers when headers are provided', () => {
    const { execute } = superagentInterface('/echo-headers', httpMethods.GET, {
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
