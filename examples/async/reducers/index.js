import { combineReducers } from 'redux'
import { SELECT_REDDIT } from '../actions'
import { entitiesReducer, requestsReducer } from 'redux-query'

function selectedReddit(state = 'reactjs', action) {
  switch (action.type) {
    case SELECT_REDDIT:
      return action.reddit
    default:
      return state
  }
}

const rootReducer = combineReducers({
  selectedReddit,
  requests: requestsReducer,
  entities: entitiesReducer
})

export default rootReducer
