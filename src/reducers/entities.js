import omit from 'lodash.omit';

import {
    MUTATE_FAILURE,
    MUTATE_START,
    MUTATE_SUCCESS,
    REQUEST_SUCCESS,
    RESET,
    REMOVE_ENTITIES,
    REMOVE_ENTITY,
} from '../constants/action-types';

const initialState = {};

const withoutPath = (state, path) => {
    const [key, ...restPath] = path;

    if (restPath.length) {
        return {
            ...state,
            [key]: withoutPath(state[key], restPath),
        };
    } else {
        return omit(state, key);
    }
};

const entities = (state = initialState, action) => {
    if (action.type === RESET) {
        return 'entities' in action ? action.entities : initialState;
    } else if (action.type === MUTATE_START && action.optimisticEntities) {
        return {
            ...state,
            ...action.optimisticEntities,
        };
    } else if (action.type === MUTATE_FAILURE && action.originalEntities) {
        return {
            ...state,
            ...action.originalEntities,
        };
    } else if (action.type === REQUEST_SUCCESS || action.type === MUTATE_SUCCESS) {
        return {
            ...state,
            ...action.entities,
        };
    } else if (action.type === REMOVE_ENTITIES) {
        return action.paths.reduce(
            (accum, path) => {
                return withoutPath(accum, path);
            },
            state
        );
    } else if (action.type === REMOVE_ENTITY) {
        return withoutPath(state, action.path);
    } else {
        return state;
    }
};

export default entities;
