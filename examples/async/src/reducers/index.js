import { combineReducers } from 'redux';
import { SELECT_REDDIT } from '../actions';
import { entitiesReducer, queriesReducer } from 'redux-query';

const selectedReddit = (state = 'reactjs', action) => {
  switch (action.type) {
    case SELECT_REDDIT:
      return action.reddit;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  selectedReddit,
  queries: queriesReducer,
  entities: entitiesReducer,
});

export default rootReducer;
