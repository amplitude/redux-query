import { assert } from 'chai';

import * as actionTypes from '../../src/constants/action-types';
import entities from '../../src/reducers/entities';

describe('entities reducer', () => {
    it('should handle REQUEST_SUCCESS', () => {
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
        assert.deepEqual(newEntities, expectedEntities);
    });

    it('should handle MUTATE_SUCCESS', () => {
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
        assert.deepEqual(newEntities, expectedEntities);
    });

    it('should handle MUTATE_START and optimistic entities', () => {
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
        assert.deepEqual(newEntities, expectedEntities);
    });

    it('should handle MUTATE_FAILURE and original entities', () => {
        const action = {
            type: actionTypes.MUTATE_FAILURE,
            originalEntities: {
                message: 'hello, world!',
            },
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
        assert.deepEqual(newEntities, expectedEntities);
    });

    it('should handle RESET', () => {
        const action = {
            type: actionTypes.RESET,
        };
        const prevState = {
            message: 'hello, world!',
            user: 'ryanashcraft',
        };
        const newEntities = entities(prevState, action);
        const expectedEntities = {};
        assert.deepEqual(newEntities, expectedEntities);
    });

    it('should handle REMOVE_ENTITY', () => {
        const action = {
            type: actionTypes.REMOVE_ENTITY,
            path: ['some', 'thing', 'gone'],
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
        assert.deepEqual(newEntities, expectedEntities);
    });

    it('should handle REMOVE_ENTITIES', () => {
        const action = {
            type: actionTypes.REMOVE_ENTITIES,
            paths: [['some', 'thing', 'gone'], ['something', 'else', 'gone']],
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
        };
        const newEntities = entities(prevState, action);
        const expectedEntities = {
            some: {
                thing: {},
            },
            something: {
                else: {},
            },
        };
        assert.deepEqual(newEntities, expectedEntities);
    });
});
