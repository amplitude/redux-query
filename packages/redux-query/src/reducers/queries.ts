import * as actionTypes from '../constants/action-types';

import { Action } from '../actions';
import { QueryKey, ResponseHeaders, Status } from '../types';

export type State = {
  [key: string]: {
    headers?: ResponseHeaders;
    isFinished: boolean;
    isMutation: boolean;
    isPending: boolean;
    lastUpdated?: number;
    queryCount: number;
    status?: Status;
  };
};

const initialState = {};

const queries = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case actionTypes.RESET: {
      return {};
    }
    case actionTypes.MUTATE_START:
    case actionTypes.REQUEST_START: {
      const { queryKey } = action;

      return {
        ...state,
        [queryKey]: {
          isFinished: false,
          isPending: true,
          isMutation: action.type === actionTypes.MUTATE_START,
          queryCount: state[queryKey] ? state[queryKey].queryCount + 1 : 1,
        },
      };
    }
    case actionTypes.REQUEST_SUCCESS:
    case actionTypes.MUTATE_FAILURE:
    case actionTypes.MUTATE_SUCCESS:
    case actionTypes.REQUEST_FAILURE: {
      const { queryKey } = action;

      return {
        ...state,
        [queryKey]: {
          ...state[queryKey],
          isFinished: true,
          isPending: false,
          lastUpdated: action.time,
          status: action.status,
          headers: action.responseHeaders,
        },
      };
    }
    case actionTypes.CANCEL_QUERY: {
      const { queryKey } = action;

      if (queryKey && state[queryKey].isPending) {
        // Make sure query is actually pending

        return {
          ...state,
          [queryKey]: {
            ...state[queryKey],
            isFinished: true,
            isPending: false,
            status: 0,
          },
        };
      }

      return state;
    }
    default: {
      return state;
    }
  }
};

export default queries;
