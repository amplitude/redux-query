import * as actionTypes from "../constants/action-types"

import {Action} from "../actions"
import {ResponseBody, ResponseHeaders, ResponseText} from "../types"

export type State = {
    [key: string]: {
        responseBody: ResponseBody | null | undefined
        responseHeaders: ResponseHeaders | null | undefined
        responseText: ResponseText | null | undefined
    }
}

const initialState = {}

const queries = (state: State = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.RESET: {
            return {}
        }
        case actionTypes.MUTATE_START:
        case actionTypes.REQUEST_START: {
            const {queryKey} = action
            const newState = {...state}

            delete newState[queryKey]

            return newState
        }
        case actionTypes.MUTATE_FAILURE:
        case actionTypes.REQUEST_FAILURE: {
            const {queryKey} = action

            return {
                ...state,
                [queryKey]: {
                    ...state[queryKey],
                    responseBody: action.responseBody,
                    responseText: action.responseText,
                    responseHeaders: action.responseHeaders,
                },
            }
        }
        default: {
            return state
        }
    }
}

export default queries