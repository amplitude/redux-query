import omit from 'lodash.omit';

import {
    MUTATE_FAILURE,
    MUTATE_START,
    MUTATE_SUCCESS,
    REQUEST_SUCCESS,
    RESET,
    UPDATE_ENTITIES,
} from '../constants/action-types';
import { optimisticUpdateEntities } from '../lib/update';

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
    } else if (action.type === MUTATE_FAILURE && action.rolledBackEntities) {
        return {
            ...state,
            ...action.rolledBackEntities,
        };
    } else if (action.type === REQUEST_SUCCESS || action.type === MUTATE_SUCCESS) {
        return {
            ...state,
            ...action.entities,
        };
    } else if (action.type === UPDATE_ENTITIES) {
        return {
            ...state,
            ...optimisticUpdateEntities(action.update, state),
        };
    } else {
        return state;
    }
};

export default entities;
