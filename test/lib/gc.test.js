import { lru } from '../../src/lib/gc';

const sec = number => number * 1000;
describe('gc', () => {
  describe('lru', () => {
    it('passes the queries as if when below the threshold', () => {
      const queries = {
        foo: { lastUpdated: Date.now() - sec(10) },
        bar: {},
      };
      expect(lru(queries)).toEqual(queries);
    });
    it('removes old queries to the limit', () => {
      const queries = {
        foobar: { lastUpdated: Date.now() - sec(30) },
        foo: { lastUpdated: Date.now() - sec(10) },
        bar: { lastUpdated: Date.now() - sec(20) },
        barfoo: { lastUpdated: Date.now() - sec(20) },
      };
      expect(lru(queries, { count: 1 })).toEqual({ foo: queries.foo });
    });
    it('omits queries without lastUpdated', () => {
      const queries = {
        foobar: {},
        foo: { lastUpdated: Date.now() - sec(10) },
        bar: { lastUpdated: Date.now() - sec(20) },
        barfoo: { lastUpdated: Date.now() - sec(20) },
      };
      expect(lru(queries, { count: 1 })).toEqual({ foo: queries.foo, foobar: {} });
    });
  });
});
