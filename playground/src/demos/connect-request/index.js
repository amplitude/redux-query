import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { entitiesReducer, queriesReducer, queryMiddleware } from 'redux-query';

import App from './App';
import code from './App.txt';

const reducer = combineReducers({
    entities: entitiesReducer,
    queries: queriesReducer,
});

const middleware = queryMiddleware((state) => state.entities, (state) => state.queries);

export default {
    code,
    component: App,
    createStore: (storeEnhancer) => {
        return createStore(reducer, compose(applyMiddleware(middleware), storeEnhancer));
    },
};
