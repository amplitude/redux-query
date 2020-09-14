import { combineReducers } from '@reduxjs/toolkit';
import { entitiesReducer, queriesReducer, queryMiddleware } from 'redux-query';
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import superagentInterface from 'redux-query-interface-superagent';
import counterReducer from '../features/counter/counterSlice';

// Important: Currently combineReducers must be used for typings to work. redux-query's reducers can't be passed to configureStore directly.
const rootReducer = combineReducers({
  counter: counterReducer,
  entities: entitiesReducer,
  queries: queriesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const getQueries = (state: RootState) => state.queries;
export const getEntities = (state: RootState) => state.entities;

export const store = configureStore({
  reducer: rootReducer,
  // Important: The following setup will not work with typescript.
  // reducer: {
  //   counter: counterReducer,
  //   entities: entitiesReducer,
  //   queries: queriesReducer
  // },
  // Important: Do not replace all default middleware like this.
  // middleware: [queryMiddleware(superagentInterface, getQueries, getEntities)],
  // Instead append like this. (Concat can take an array if need be.)
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(queryMiddleware(superagentInterface, getQueries, getEntities)),
});

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
