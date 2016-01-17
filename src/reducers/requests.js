import values from 'lodash/values';
import includes from 'lodash/includes';

import * as actionTypes from '../constants/action-types';

const request = (state = { status: null, isPending: false, lastUpdated: null }, action) => {
    return {
        ...state,
        status: action.status || state.status,
        isPending: action.type === actionTypes.REQUEST_START,
        lastUpdated: action.type !== actionTypes.REQUEST_START ? action.time : state.lastUpdated,
    };
};

const requests = (state = {}, action) => {
    if (includes(values(actionTypes), action.type)) {
        return {
            ...state,
            [action.url]: request(state[action.url], action),
        };
    } else {
        return state;
    }
};

export default requests;
