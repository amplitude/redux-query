import superagent from 'superagent';
import superagentMock from 'superagent-mock';
import { HttpMethod } from 'redux-query';

import superagentInterface from '../src';

const mockEndpoint = (requestHttpMethod) => () => {
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
    delete: mockEndpoint(HttpMethod.DELETE),
    get: mockEndpoint(HttpMethod.GET),
    head: mockEndpoint(HttpMethod.HEAD),
    patch: mockEndpoint(HttpMethod.PATCH),
    post: mockEndpoint(HttpMethod.POST),
    put: mockEndpoint(HttpMethod.PUT),
  },
];

superagentMock(superagent, superagentMockConfig);

describe('superagent interface', () => {
  test('returns an object with both execute and abort functions, as well as the request instance', () => {
    const networkInterface = superagentInterface('/api', HttpMethod.GET);
    expect(typeof networkInterface.execute).toBe('function');
    expect(typeof networkInterface.abort).toBe('function');
  });

  test('returns a DELETE request when supplied a HEAD method', () => {
    const { execute } = superagentInterface('/api', HttpMethod.DELETE);

    execute((err, status, body, text) => {
      expect(status).toEqual(200);
      expect(text).toEqual(HttpMethod.DELETE);
    });
  });

  test('returns a GET request when supplied a GET method', () => {
    const { execute } = superagentInterface('/api', HttpMethod.GET);

    execute((err, status, body, text) => {
      expect(status).toEqual(200);
      expect(text).toEqual(HttpMethod.GET);
    });
  });

  test('returns a HEAD request when supplied a HEAD method', () => {
    const { execute } = superagentInterface('/api', HttpMethod.HEAD);

    execute((err, status, body, text) => {
      expect(status).toEqual(200);
      expect(text).toEqual(HttpMethod.HEAD);
    });
  });

  test('returns a PATCH request when supplied a PATCH method', () => {
    const { execute } = superagentInterface('/api', HttpMethod.PATCH);

    execute((err, status, body, text) => {
      expect(status).toEqual(200);
      expect(text).toEqual(HttpMethod.PATCH);
    });
  });

  test('returns a POST request when supplied a POST method', () => {
    const { execute } = superagentInterface('/api', HttpMethod.POST);

    execute((err, status, body, text) => {
      expect(status).toEqual(200);
      expect(text).toEqual(HttpMethod.POST);
    });
  });

  test('returns a PUT request when supplied a PUT method', () => {
    const { execute } = superagentInterface('/api', HttpMethod.PUT);

    execute((err, status, body, text) => {
      expect(status).toEqual(200);
      expect(text).toEqual(HttpMethod.PUT);
    });
  });

  test('throws an error when supplied an invalid HTTP method', () => {
    const invalid = () => superagentInterface('/api', 'foo');
    expect(invalid).toThrow();
  });

  test('includes headers when headers are provided', () => {
    const { execute } = superagentInterface('/echo-headers', HttpMethod.GET, {
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
