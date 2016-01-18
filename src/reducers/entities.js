import mapValues from 'lodash/mapValues';

import { REQUEST_SUCCCESS, MUTATE_SUCCESS } from '../constants/action-types';

const entities = (state = {}, action) => {
    if (action.type === REQUEST_SUCCCESS || action.type === MUTATE_SUCCESS) {
        return {
            ...state,
            ...mapValues(action.entities, (value, key) => {
                return {
                    ...state[key],
                    ...value,
                };
            }),
        };
    } else {
        return state;
    }
};

export default entities;
