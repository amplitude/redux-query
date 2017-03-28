import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { entitiesReducer, queriesReducer, queryMiddlewareAdvanced } from 'redux-query/advanced';

import App from './App';
import code from './App.txt';

const reducer = combineReducers({
    entities: entitiesReducer,
    queries: queriesReducer,
});

const fakeAdapter = () => {
    const execute = (cb) => {
        const response = { message: 'World' };
        setTimeout(() => {
            cb(null, 200, response, JSON.stringify(response));
        }, 1000);
    };

    const abort = () => {};

    return {
        execute,
        abort,
    };
};

const middleware = queryMiddlewareAdvanced(fakeAdapter)((state) => state.entities, (state) => state.queries);

export default {
    code,
    component: App,
    createStore: (storeEnhancer) => {
        return createStore(reducer, compose(applyMiddleware(middleware), storeEnhancer));
    },
};
