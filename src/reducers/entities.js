import mapValues from 'lodash/mapValues';

import { REQUEST_SUCCCESS, MUTATE_SUCCESS } from '../constants/action-types';

const entities = (state = {}, action) => {
    if (action.type === REQUEST_SUCCCESS || action.type === MUTATE_SUCCESS) {
        return {
            ...state,
            ...action.entities,
        };
    } else {
        return state;
    }
};

export default entities;
