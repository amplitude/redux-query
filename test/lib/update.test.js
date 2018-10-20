import { updateEntities, optimisticUpdateEntities } from '../../src/lib/update';

describe('updateEntities', () => {
  it('does nothing when there is no update func', () => {
    const entities = { foos: [] };
    expect(updateEntities(undefined, entities)).toMatchObject({});
  });

  it('throws in an empty object when there are no entities', () => {
    const updaters = { foo: () => 'foo' };
    expect(updateEntities(updaters, undefined)).toMatchObject({ foo: 'foo' });
  });

  it('runs update func on transformed entities', () => {
    const entities = { foos: ['foo'] };
    const updaters = {
      foos: (prev, next) => [...prev, ...next],
    };
    const updated = updateEntities(updaters, entities, { foos: ['foo2'], bar: 'bar' });
    expect(updated.foos).toHaveLength(2);
    expect(updated.foos[0]).toBe('foo');
    expect(updated.foos[1]).toBe('foo2');
  });
});

describe('optimisticUpdateEntities', () => {
  it('updates entities with updater funcs', () => {
    const updaters = { foo: prev => [...prev, 'bar'] };
    expect(optimisticUpdateEntities(updaters, { foo: ['foo'] }).foo).toHaveLength(2);
  });
});
