import { pick } from '../../src/lib/object';

describe('pick', () => {
  test('should do nothing with empty objects and no keys', () => {
    expect(pick({})).toEqual({});
  });

  test('should do nothing with empty objects and keys', () => {
    expect(pick({}, ['a'])).toEqual({});
  });

  test('should return the same object with a single key when that key is one of the keys to pick', () => {
    expect(pick({ a: 'a' }, ['a'])).toEqual({ a: 'a' });
  });

  test('should return an empty when the only key is not one of the keys to pick', () => {
    expect(pick({ a: 'a' }, ['b'])).toEqual({});
  });

  test('should work with multiple keys', () => {
    expect(pick({ a: 'a', b: 'b', c: 'c' }, ['b', 'c'])).toEqual({ b: 'b', c: 'c' });
  });
});
