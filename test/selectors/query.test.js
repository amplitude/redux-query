import { assert } from 'chai';

import { getQueryKey } from '../../src/lib/query-key';
import * as querySelectors from '../../src/selectors/query';

describe('query selectors', () => {
    describe('isFinished', () => {
        it('should work with just url', () => {
            const isFinished = querySelectors.isFinished('/api/dashboards')({
                '{"url":"/api/dashboards"}': {
                    isFinished: true,
                },
            });
            assert.isTrue(isFinished);
        });

        it('should work with a config', () => {
            const queryConfig = {
                url: '/api/dashboard/1/rename',
                body: {
                    name: 'My KPIs',
                },
            };
            const queryKey = getQueryKey(queryConfig.url, queryConfig.body);
            const isFinished = querySelectors.isFinished(queryConfig)({
                [queryKey]: {
                    isFinished: true,
                },
            });
            assert.isTrue(isFinished);
        });

        it('should work with a config with a queryKey field', () => {
            const queryConfig = {
                url: '/api/dashboard/1/rename',
                body: {
                    name: 'My KPIs',
                },
                queryKey: 'myQueryKey',
            };
            const isFinished = querySelectors.isFinished(queryConfig)({
                myQueryKey: {
                    isFinished: true,
                },
            });
            assert.isTrue(isFinished);
        });
    });

    describe('isPending', () => {
        it('should work with just url', () => {
            const isPending = querySelectors.isPending('/api/dashboards')({
                '{"url":"/api/dashboards"}': {
                    isPending: true,
                },
            });
            assert.isTrue(isPending);
        });

        it('should work with a config', () => {
            const queryConfig = {
                url: '/api/dashboard/1/rename',
                body: {
                    name: 'My KPIs',
                },
            };
            const queryKey = getQueryKey(queryConfig.url, queryConfig.body);
            const isPending = querySelectors.isPending(queryConfig)({
                [queryKey]: {
                    isPending: true,
                },
            });
            assert.isTrue(isPending);
        });

        it('should work with a config with a queryKey field', () => {
            const queryConfig = {
                url: '/api/dashboard/1/rename',
                body: {
                    name: 'My KPIs',
                },
                queryKey: 'myQueryKey',
            };
            const isPending = querySelectors.isPending(queryConfig)({
                myQueryKey: {
                    isPending: true,
                },
            });
            assert.isTrue(isPending);
        });
    });

    describe('status', () => {
        it('should work with just url', () => {
            const status = querySelectors.status('/api/dashboards')({
                '{"url":"/api/dashboards"}': {
                    status: 200,
                },
            });
            assert.equal(status, 200);
        });

        it('should work with a config', () => {
            const queryConfig = {
                url: '/api/dashboard/1/rename',
                body: {
                    name: 'My KPIs',
                },
            };
            const queryKey = getQueryKey(queryConfig.url, queryConfig.body);
            const status = querySelectors.status(queryConfig)({
                [queryKey]: {
                    status: 200,
                },
            });
            assert.equal(status, 200);
        });

        it('should work with a config with a queryKey field', () => {
            const queryConfig = {
                url: '/api/dashboard/1/rename',
                body: {
                    name: 'My KPIs',
                },
                queryKey: 'myQueryKey',
            };
            const status = querySelectors.status(queryConfig)({
                myQueryKey: {
                    status: 200,
                },
            });
            assert.equal(status, 200);
        });
    });

    describe('lastUpdated', () => {
        it('should work with just url', () => {
            const lastUpdated = querySelectors.lastUpdated('/api/dashboards')({
                '{"url":"/api/dashboards"}': {
                    lastUpdated: 1488471746117,
                },
            });
            assert.equal(lastUpdated, 1488471746117);
        });

        it('should work with a config', () => {
            const queryConfig = {
                url: '/api/dashboard/1/rename',
                body: {
                    name: 'My KPIs',
                },
            };
            const queryKey = getQueryKey(queryConfig.url, queryConfig.body);
            const lastUpdated = querySelectors.lastUpdated(queryConfig)({
                [queryKey]: {
                    lastUpdated: 1488471746117,
                },
            });
            assert.equal(lastUpdated, 1488471746117);
        });

        it('should work with a config with a queryKey field', () => {
            const queryConfig = {
                url: '/api/dashboard/1/rename',
                body: {
                    name: 'My KPIs',
                },
                queryKey: 'myQueryKey',
            };
            const lastUpdated = querySelectors.lastUpdated(queryConfig)({
                myQueryKey: {
                    lastUpdated: 1488471746117,
                },
            });
            assert.equal(lastUpdated, 1488471746117);
        });
    });

    describe('queryCount', () => {
        it('should work with just url', () => {
            const queryCount = querySelectors.queryCount('/api/dashboards')({
                '{"url":"/api/dashboards"}': {
                    queryCount: 2,
                },
            });
            assert.equal(queryCount, 2);
        });

        it('should work with a config', () => {
            const queryConfig = {
                url: '/api/dashboard/1/rename',
                body: {
                    name: 'My KPIs',
                },
            };
            const queryKey = getQueryKey(queryConfig.url, queryConfig.body);
            const queryCount = querySelectors.queryCount(queryConfig)({
                [queryKey]: {
                    queryCount: 2,
                },
            });
            assert.equal(queryCount, 2);
        });

        it('should work with a config with a queryKey field', () => {
            const queryConfig = {
                url: '/api/dashboard/1/rename',
                body: {
                    name: 'My KPIs',
                },
                queryKey: 'myQueryKey',
            };
            const queryCount = querySelectors.queryCount(queryConfig)({
                myQueryKey: {
                    queryCount: 2,
                },
            });
            assert.equal(queryCount, 2);
        });
    });

    describe('responseBody', () => {
        it('should work with just url', () => {
            const responseBody = querySelectors.responseBody('/api/dashboards')({
                '{"url":"/api/dashboards"}': {
                    responseBody: { some: 'json' },
                },
            });
            assert.deepEqual(responseBody, { some: 'json' });
        });

        it('should work with a config', () => {
            const queryConfig = {
                url: '/api/dashboard/1/rename',
                body: {
                    name: 'My KPIs',
                },
            };
            const queryKey = getQueryKey(queryConfig.url, queryConfig.body);
            const responseBody = querySelectors.responseBody(queryConfig)({
                [queryKey]: {
                    responseBody: { some: 'json' },
                },
            });
            assert.deepEqual(responseBody, { some: 'json' });
        });

        it('should work with a config with a queryKey field', () => {
            const queryConfig = {
                url: '/api/dashboard/1/rename',
                body: {
                    name: 'My KPIs',
                },
                queryKey: 'myQueryKey',
            };
            const responseBody = querySelectors.responseBody(queryConfig)({
                myQueryKey: {
                    responseBody: { some: 'json' },
                },
            });
            assert.deepEqual(responseBody, { some: 'json' });
        });
    });
});
