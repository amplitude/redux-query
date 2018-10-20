import * as HTTPMethods from '../../src/constants/http-methods';
import superagentInterface from '../../src/network-interfaces/superagent';

describe('superagent interface', () => {
  test('must return an object with both execute and abort functions, as well as the request instance', () => {
    const networkInterface = superagentInterface('http://localhost', HTTPMethods.GET);
    expect(typeof networkInterface.execute).toBe('function');
    expect(typeof networkInterface.abort).toBe('function');
    expect(networkInterface.instance).toBeTruthy();
  });

  test('must return a HEAD request when supplied a HEAD method', () => {
    const { instance } = superagentInterface('http://localhost', HTTPMethods.HEAD);
    expect(instance.method).toEqual(HTTPMethods.HEAD);
  });

  test('must return a DELETE request when supplied a DELETE method', () => {
    const { instance } = superagentInterface('http://localhost', HTTPMethods.DELETE);
    expect(instance.method).toEqual(HTTPMethods.DELETE);
  });

  test('must return a GET request when supplied a GET method', () => {
    const { instance } = superagentInterface('http://localhost', HTTPMethods.GET);
    expect(instance.method).toEqual(HTTPMethods.GET);
  });

  test('must return a PATCH request when supplied a PATCH method', () => {
    const { instance } = superagentInterface('http://localhost', HTTPMethods.PATCH);
    expect(instance.method).toEqual(HTTPMethods.PATCH);
  });

  test('must return a POST request when supplied a POST method', () => {
    const { instance } = superagentInterface('http://localhost', HTTPMethods.POST);
    expect(instance.method).toEqual(HTTPMethods.POST);
  });

  test('must return a PUT request when supplied a PUT method', () => {
    const { instance } = superagentInterface('http://localhost', HTTPMethods.PUT);
    expect(instance.method).toEqual(HTTPMethods.PUT);
  });

  test('must throw an error when supplied an invalid HTTP method', () => {
    const invalid = () => superagentInterface('http://localhost', 'abc');
    expect(invalid).toThrow();
  });

  test('must call withCredentials on the request if they are included', () => {
    const { instance } = superagentInterface('http://localhost', HTTPMethods.GET, {
      credentials: 'include',
    });
    expect(instance._withCredentials).toBe(true);
  });

  test('must pass response body and body upon execution', done => {
    const { instance, execute } = superagentInterface('http://localhost', HTTPMethods.GET);
    let callback;
    instance.end = jest.fn(receivedCallback => {
      callback = receivedCallback;
    });
    execute((err, responseStatus, responseBody, responseText, responseHeaders) => {
      expect(responseStatus).toBe(200);
      expect(responseBody).toBe('body');
      expect(responseText).toBe('text');
      expect(responseHeaders).toBe('headers');
      expect(err).toBe('error');
      done();
    });
    callback('error', {
      status: 200,
      body: 'body',
      text: 'text',
      header: 'headers',
    });
  });

  test('must pass undefined when there is no response', done => {
    const { instance, execute } = superagentInterface('http://localhost', HTTPMethods.GET);
    let callback;
    instance.end = jest.fn(receivedCallback => {
      callback = receivedCallback;
    });
    execute((err, responseStatus, responseBody, responseText, responseHeaders) => {
      expect(responseStatus).toBe(0);
      expect(responseBody).toBeUndefined();
      expect(responseText).toBeUndefined();
      expect(responseHeaders).toBeUndefined();
      expect(err).toBe('error');
      done();
    });
    callback('error', undefined);
  });

  test('must call abort on request upon abort', () => {
    const { instance, abort } = superagentInterface('http://localhost', HTTPMethods.GET);
    instance.abort = jest.fn();
    abort();
    expect(instance.abort).toHaveBeenCalled();
  });
});
