import { assert } from 'chai';
import * as HTTPMethods from '../../src/constants/http-methods';
import superagentAdapter from '../../src/adapters/superagent';

describe('superagent adapter', () => {
    it('must return an object with both execute and abort functions, as well as the request instance', () => {
        const adapter = superagentAdapter('http://localhost', HTTPMethods.GET);
        assert.isFunction(adapter.execute);
        assert.isFunction(adapter.abort);
        assert(adapter.instance);
    });

    it('must return a HEAD request when supplied a HEAD method', () => {
        const { instance } = superagentAdapter('http://localhost', HTTPMethods.HEAD);
        assert.equal(instance.method, HTTPMethods.HEAD);
    });

    it('must return a DELETE request when supplied a DELETE method', () => {
        const { instance } = superagentAdapter('http://localhost', HTTPMethods.DELETE);
        assert.equal(instance.method, HTTPMethods.DELETE);
    });

    it('must return a GET request when supplied a GET method', () => {
        const { instance } = superagentAdapter('http://localhost', HTTPMethods.GET);
        assert.equal(instance.method, HTTPMethods.GET);
    });

    it('must return a PATCH request when supplied a PATCH method', () => {
        const { instance } = superagentAdapter('http://localhost', HTTPMethods.PATCH);
        assert.equal(instance.method, HTTPMethods.PATCH);
    });

    it('must return a POST request when supplied a POST method', () => {
        const { instance } = superagentAdapter('http://localhost', HTTPMethods.POST);
        assert.equal(instance.method, HTTPMethods.POST);
    });

    it('must return a PUT request when supplied a PUT method', () => {
        const { instance } = superagentAdapter('http://localhost', HTTPMethods.PUT);
        assert.equal(instance.method, HTTPMethods.PUT);
    });

    it('must throw an error when supplied an invalid HTTP method', () => {
        const invalid = () => superagentAdapter('http://localhost', 'abc');
        assert.throws(invalid, /Unsupported HTTP method/);
    });
});
