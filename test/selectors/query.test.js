import { getQueryKey } from '../../src/lib/query-key';
import * as querySelectors from '../../src/selectors/query';

describe('query selectors', () => {
  describe('isFinished', () => {
    test('should return undefined when there is no query config', () => {
      expect(querySelectors.isFinished({})).toBeUndefined();
    });

    test('should work with a config', () => {
      const queryConfig = {
        url: '/api/dashboard/1/rename',
        body: {
          name: 'My KPIs',
        },
      };
      const queryKey = getQueryKey(queryConfig);
      const isFinished = querySelectors.isFinished(
        {
          [queryKey]: {
            isFinished: true,
          },
        },
        queryConfig,
      );
      expect(isFinished).toBe(true);
    });

    test('should work with a config with a queryKey field', () => {
      const queryConfig = {
        url: '/api/dashboard/1/rename',
        body: {
          name: 'My KPIs',
        },
        queryKey: 'myQueryKey',
      };
      const isFinished = querySelectors.isFinished(
        {
          myQueryKey: {
            isFinished: true,
          },
        },
        queryConfig,
      );
      expect(isFinished).toBe(true);
    });
  });

  describe('isPending', () => {
    test('should return undefined when there is no query config', () => {
      expect(querySelectors.isPending({})).toBeUndefined();
    });

    test('should work with a config', () => {
      const queryConfig = {
        url: '/api/dashboard/1/rename',
        body: {
          name: 'My KPIs',
        },
      };
      const queryKey = getQueryKey(queryConfig);
      const isPending = querySelectors.isPending(
        {
          [queryKey]: {
            isPending: true,
          },
        },
        queryConfig,
      );
      expect(isPending).toBe(true);
    });

    test('should work with a config with a queryKey field', () => {
      const queryConfig = {
        url: '/api/dashboard/1/rename',
        body: {
          name: 'My KPIs',
        },
        queryKey: 'myQueryKey',
      };
      const isPending = querySelectors.isPending(
        {
          myQueryKey: {
            isPending: true,
          },
        },
        queryConfig,
      );
      expect(isPending).toBe(true);
    });
  });

  describe('status', () => {
    test('returns undefined when there is no query config', () => {
      expect(querySelectors.status({})).toBeUndefined();
    });
    test('should work with a config', () => {
      const queryConfig = {
        url: '/api/dashboard/1/rename',
        body: {
          name: 'My KPIs',
        },
      };
      const queryKey = getQueryKey(queryConfig);
      const status = querySelectors.status(
        {
          [queryKey]: {
            status: 200,
          },
        },
        queryConfig,
      );
      expect(status).toEqual(200);
    });

    test('should work with a config with a queryKey field', () => {
      const queryConfig = {
        url: '/api/dashboard/1/rename',
        body: {
          name: 'My KPIs',
        },
        queryKey: 'myQueryKey',
      };
      const status = querySelectors.status(
        {
          myQueryKey: {
            status: 200,
          },
        },
        queryConfig,
      );
      expect(status).toEqual(200);
    });
  });

  describe('headers', () => {
    test('returns undefined when there is no query config', () => {
      expect(querySelectors.headers({})).toBeUndefined();
    });
    test('should work with a config', () => {
      const queryConfig = {
        url: '/api/dashboard/1/rename',
        body: {
          name: 'My KPIs',
        },
      };
      const queryKey = getQueryKey(queryConfig);
      const headers = querySelectors.headers(
        {
          [queryKey]: { headers: { 'Content-length': 100 } },
        },
        queryConfig,
      );
      expect(headers).toMatchObject({ 'Content-length': 100 });
    });

    test('should work with a config with a queryKey field', () => {
      const queryConfig = {
        url: '/api/dashboard/1/rename',
        body: {
          name: 'My KPIs',
        },
        queryKey: 'myQueryKey',
      };
      const headers = querySelectors.headers(
        {
          myQueryKey: { headers: { 'Content-length': 100 } },
        },
        queryConfig,
      );
      expect(headers).toMatchObject({ 'Content-length': 100 });
    });
  });

  describe('lastUpdated', () => {
    test('should return undefined when there is no query config', () => {
      expect(querySelectors.lastUpdated({})).toBeUndefined();
    });
    test('should work with a config', () => {
      const queryConfig = {
        url: '/api/dashboard/1/rename',
        body: {
          name: 'My KPIs',
        },
      };
      const queryKey = getQueryKey(queryConfig);
      const lastUpdated = querySelectors.lastUpdated(
        {
          [queryKey]: {
            lastUpdated: 1488471746117,
          },
        },
        queryConfig,
      );
      expect(lastUpdated).toEqual(1488471746117);
    });

    test('should work with a config with a queryKey field', () => {
      const queryConfig = {
        url: '/api/dashboard/1/rename',
        body: {
          name: 'My KPIs',
        },
        queryKey: 'myQueryKey',
      };
      const lastUpdated = querySelectors.lastUpdated(
        {
          myQueryKey: {
            lastUpdated: 1488471746117,
          },
        },
        queryConfig,
      );
      expect(lastUpdated).toEqual(1488471746117);
    });
  });

  describe('queryCount', () => {
    test('should return undefined when there is no query config', () => {
      expect(querySelectors.queryCount({})).toBeUndefined();
    });
    test('should work with a config', () => {
      const queryConfig = {
        url: '/api/dashboard/1/rename',
        body: {
          name: 'My KPIs',
        },
      };
      const queryKey = getQueryKey(queryConfig);
      const queryCount = querySelectors.queryCount(
        {
          [queryKey]: {
            queryCount: 2,
          },
        },
        queryConfig,
      );
      expect(queryCount).toEqual(2);
    });

    test('should work with a config with a queryKey field', () => {
      const queryConfig = {
        url: '/api/dashboard/1/rename',
        body: {
          name: 'My KPIs',
        },
        queryKey: 'myQueryKey',
      };
      const queryCount = querySelectors.queryCount(
        {
          myQueryKey: {
            queryCount: 2,
          },
        },
        queryConfig,
      );
      expect(queryCount).toEqual(2);
    });
  });
});
