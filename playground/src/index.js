import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import DocViewer from './components/DocViewer';
import Playground from './components/Playground';

import readme from '../../README.md';

import hackerNews from './demos/hacker-news';
import helloWorld from './demos/hello-world';
import mounting from './demos/mounting';
import mutations from './demos/mutations';
import updating from './demos/updating';

import './index.css';

ReactDOM.render(
  <Router>
    <Switch>
      <Route
        path="/"
        exact={true}
        component={() => <DocViewer doc={readme} />}
      />
      <Route
        path="/hello-world"
        component={() => <Playground demo={helloWorld} />}
      />
      <Route
        path="/mounting"
        component={() => <Playground demo={mounting} />}
      />
      <Route
        path="/updating"
        component={() => <Playground demo={updating} />}
      />
      <Route
        path="/mutations"
        component={() => <Playground demo={mutations} />}
      />
      <Route
        path="/hacker-news"
        component={() => <Playground demo={hackerNews} />}
      />
      <Route render={() => <Redirect to="/hello-world" />} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
