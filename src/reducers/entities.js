import mapValues from 'lodash/mapValues';

import { REQUEST_SUCCCESS } from '../constants/action-types';

const entities = (state = {}, action) => {
    if (action.type === REQUEST_SUCCCESS) {
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
