import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import DocViewer from './components/DocViewer';
import Playground from './components/Playground';

import changelog from '../../CHANGELOG.md';
import readme from '../../README.md';

import hackerNews from './demos/hacker-news';
import helloWorld from './demos/hello-world';
import mounting from './demos/mounting';
import mutations from './demos/mutations';
import reduxSaga from './demos/redux-saga';
import updating from './demos/updating';

import './index.css';

ReactDOM.render(
  <Router>
    <Switch>
      <Route
        path="/"
        exact={true}
        component={() => <DocViewer name="readme" doc={readme} />}
      />
      <Route
        path="/changelog"
        component={() => <DocViewer name="changelog" doc={changelog} />}
      />
      <Route
        path="/hello-world"
        component={() => <Playground name="hello world" demo={helloWorld} />}
      />
      <Route
        path="/mounting"
        component={() => <Playground name="mounting" demo={mounting} />}
      />
      <Route
        path="/updating"
        component={() => <Playground name="updating" demo={updating} />}
      />
      <Route
        path="/mutations"
        component={() => <Playground name="mutations" demo={mutations} />}
      />
      <Route
        path="/hacker-news"
        component={() => <Playground name="hacker news" demo={hackerNews} />}
      />
      <Route
        path="/redux-saga"
        component={() => <Playground name="redux-saga" demo={reduxSaga} />}
      />
      <Route render={() => <Redirect to="/hello-world" />} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
