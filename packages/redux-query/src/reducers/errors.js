import omit from 'lodash.omit';

import * as actionTypes from '../constants/action-types';

const initialState = {};

const queries = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RESET: {
      return {};
    }
    case actionTypes.MUTATE_START:
    case actionTypes.REQUEST_START: {
      const { queryKey } = action;

      return omit(state, queryKey);
    }
    case actionTypes.MUTATE_FAILURE:
    case actionTypes.REQUEST_FAILURE: {
      const { queryKey } = action;

      return {
        ...state,
        [queryKey]: {
          ...state[queryKey],
          responseBody: action.responseBody,
          responseText: action.responseText,
          responseHeaders: action.responseHeaders,
        },
      };
    }
    default: {
      return state;
    }
  }
};

export default queries;
