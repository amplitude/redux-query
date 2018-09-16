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
});
