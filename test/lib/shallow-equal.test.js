import shallowEqual from '../../src/lib/shallow-equal';
describe('shallowEqual', () => {
  it('returs true for zeroes', () => {
    expect(shallowEqual(0, 0)).toBeTruthy();
  });

  it('returns true for Infinity', () => {
    expect(shallowEqual(Infinity, Infinity)).toBeTruthy();
    expect(shallowEqual(-Infinity, -Infinity)).toBeTruthy();
  });

  it('returns false for Infinity with different signs', () => {
    expect(shallowEqual(-Infinity, +Infinity)).toBeFalsy();
  });

  it('returns true for two NaNs', () => {
    expect(shallowEqual(NaN, NaN)).toBeTruthy();
  });

  it('returns false if a or b is not an object and other one is', () => {
    expect(shallowEqual('', {})).toBeFalsy();
    expect(shallowEqual({}, '')).toBeFalsy();
  });

  it('returns false for objects with different length key sets', () => {
    expect(shallowEqual({ foo: 'bar' }, { foo: 'bar', bar: 'foo' })).toBeFalsy();
  });

  it('returns false for non-matching objects', () => {
    expect(shallowEqual({ foo: 'bar' }, { foo: 'bar2' })).toBeFalsy();
  });

  it('returns true for matching objects', () => {
    expect(shallowEqual({ foo: 'bar', bar: 'foo' }, { bar: 'foo', foo: 'bar' })).toBeTruthy();
  });
});
