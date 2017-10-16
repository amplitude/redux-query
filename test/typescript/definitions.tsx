import * as React from 'react';
import { connect } from 'react-redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';

import { queryMiddlewareAdvanced } from '../../advanced';
import {
  connectRequest,
  ForceRequestProp,
  NetworkInterface,
  queryMiddleware,
  querySelectors,
  RequestConfig,
} from '../../index';

export interface Article {
  id: number;
  title: string;
}

export interface State {
  entities: {
    articles?: { [key: string]: Article };
  };
  queries: any;
}

export const getEntities = (state: State) => state.entities;
export const getQueries = (state: State) => state.queries;

export const getArticles = (state: State) => state.entities.articles;
export const getArticleList = (state: State) => {
  const articles = getArticles(state);
  return Object.keys(articles).map(k => articles[k]);
};

const reducer = combineReducers({ entities: getEntities, queries: getQueries });
export const store = createStore(
  reducer,
  applyMiddleware(queryMiddleware(getQueries, getEntities)),
);

const dummyNetworkInterface: NetworkInterface = (url, method, config) => {
  const body = { message: 'ok' };
  return {
    execute: callback => {
      callback(null, 200, body, JSON.stringify(body), {});
    },
    abort: () => {},
  };
};

export const middleware = queryMiddlewareAdvanced(dummyNetworkInterface);

// Component

export interface OwnProps {
  categorySlug: string;
}

export interface StateProps {
  articleList: any[];
  queryConfig: RequestConfig;
}

export type RequestProps = OwnProps & StateProps;
export type Props = RequestProps & ForceRequestProp;

const Category: React.SFC<Props> = props => (
  <div>
    <h1>Category: {props.categorySlug}</h1>
    {props.articleList.map(article => (
      <article key={article.id}>
        <h1>{article.title}</h1>
      </article>
    ))}
    <button onClick={props.forceRequest}>Load new articles</button>
  </div>
);

const getQueryConfig = (categorySlug: string): RequestConfig => ({
  url: '/publications/' + categorySlug + '/articles',
  update: {
    articles: (prevValue, transformedValue) => ({
      ...prevValue,
      ...transformedValue,
    }),
  },
});

const CategoryContainer = compose(
  connect<StateProps, undefined, OwnProps>((state, ownProps) => ({
    articleList: getArticleList(state),
    isFinished: querySelectors.isFinished(
      getQueries(state),
      getQueryConfig(ownProps.categorySlug),
    ),
    queryConfig: getQueryConfig(ownProps.categorySlug),
  })),
  connectRequest<StateProps>(props => props.queryConfig),
)(Category);

export default () => (
  <div>
    <CategoryContainer categorySlug="redux" />
    <CategoryContainer categorySlug="react" />
  </div>
);
