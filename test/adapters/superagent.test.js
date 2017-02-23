import { assert } from 'chai';
import * as HTTPMethods from '../../src/constants/http-methods';
import superagentAdapter, { __createRequest } from '../../src/adapters/superagent';

describe('superagent adapter', () => {
    it('must return an object with both execute and abort functions', () => {
        const adapter = superagentAdapter('http://localhost', HTTPMethods.GET);
        assert.isFunction(adapter.execute);
        assert.isFunction(adapter.abort);
    });

    describe('__createRequest', () => {
        it('must return a DELETE request when supplied a DELETE method', () => {
            const request = __createRequest('http://localhost', HTTPMethods.DELETE);
            assert.equal(request.method, HTTPMethods.DELETE);
        });

        it('must return a GET request when supplied a GET method', () => {
            const request = __createRequest('http://localhost', HTTPMethods.GET);
            assert.equal(request.method, HTTPMethods.GET);
        });

        it('must return a POST request when supplied a POST method', () => {
            const request = __createRequest('http://localhost', HTTPMethods.POST);
            assert.equal(request.method, HTTPMethods.POST);
        });

        it('must return a PUT request when supplied a PUT method', () => {
            const request = __createRequest('http://localhost', HTTPMethods.PUT);
            assert.equal(request.method, HTTPMethods.PUT);
        });

        it('must throw an error when supplied an invalid HTTP method', () => {
            const createRequest = () => __createRequest('http://localhost', 'abc');
            assert.throws(createRequest, /Unsupported HTTP method/);
        });
    });
});
