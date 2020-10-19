import * as actionTypes from '../../src/constants/action-types';
import entities from '../../src/reducers/entities';

describe('entities reducer', () => {
  test('should handle REQUEST_SUCCESS', () => {
    const action = {
      type: actionTypes.REQUEST_SUCCESS,
      entities: {
        message: 'hello, world!',
      },
    };
    const prevState = {
      user: 'ryanashcraft',
    };
    const newEntities = entities(prevState, action);
    const expectedEntities = {
      message: 'hello, world!',
      user: 'ryanashcraft',
    };
    expect(newEntities).toEqual(expectedEntities);
  });

  test('should handle MUTATE_SUCCESS', () => {
    const action = {
      type: actionTypes.MUTATE_SUCCESS,
      entities: {
        message: 'hello, world!',
      },
    };
    const prevState = {
      user: 'ryanashcraft',
    };
    const newEntities = entities(prevState, action);
    const expectedEntities = {
      message: 'hello, world!',
      user: 'ryanashcraft',
    };
    expect(newEntities).toEqual(expectedEntities);
  });

  test('should handle MUTATE_START and optimistic entities', () => {
    const action = {
      type: actionTypes.MUTATE_START,
      optimisticEntities: {
        message: 'hello, optimistic world!',
      },
    };
    const prevState = {
      message: 'hello, world!',
      user: 'ryanashcraft',
    };
    const newEntities = entities(prevState, action);
    const expectedEntities = {
      message: 'hello, optimistic world!',
      user: 'ryanashcraft',
    };
    expect(newEntities).toEqual(expectedEntities);
  });

  test('should handle MUTATE_FAILURE and original entities', () => {
    const action = {
      type: actionTypes.MUTATE_FAILURE,
      rolledBackEntities: {
        message: 'hello, world!',
      },
    };
    const prevState = {
      message: 'hello, optimistic world!',
      user: 'ryanashcraft',
    };
    const newEntities = entities(prevState, action);
    const expectedEntities = {
      message: 'hello, world!',
      user: 'ryanashcraft',
    };
    expect(newEntities).toEqual(expectedEntities);
  });

  test('should handle RESET', () => {
    const action = {
      type: actionTypes.RESET,
    };
    const prevState = {
      message: 'hello, world!',
      user: 'ryanashcraft',
    };
    const newEntities = entities(prevState, action);
    const expectedEntities = {};
    expect(newEntities).toEqual(expectedEntities);
  });

  test('should handle UPDATE_ENTITIES', () => {
    const action = {
      type: actionTypes.UPDATE_ENTITIES,
      update: {
        some: value => ({
          ...value,
          thing: {},
        }),
      },
    };
    const prevState = {
      some: {
        thing: {
          gone: {},
        },
      },
    };
    const newEntities = entities(prevState, action);
    const expectedEntities = {
      some: {
        thing: {},
      },
    };
    expect(newEntities).toEqual(expectedEntities);
  });

  test('should handle UPDATE_ENTITIES with multiple entities', () => {
    const action = {
      type: actionTypes.UPDATE_ENTITIES,
      update: {
        some: value => ({
          ...value,
          thing: {},
        }),
        something: value => ({
          ...value,
          else: {},
        }),
      },
    };
    const prevState = {
      some: {
        thing: {
          gone: {},
        },
      },
      something: {
        else: {
          gone: {},
        },
      },
      dont: {
        touch: {
          this: {},
        },
      },
    };
    const newEntities = entities(prevState, action);
    const expectedEntities = {
      some: {
        thing: {},
      },
      something: {
        else: {},
      },
      dont: {
        touch: {
          this: {},
        },
      },
    };
    expect(newEntities).toEqual(expectedEntities);
  });
});
