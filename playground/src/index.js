import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import Playground from './components/Playground';
import mounting from './demos/mounting';
import updating from './demos/updating';
import helloWorld from './demos/hello-world';
import hackerNews from './demos/hacker-news';

import './index.css';

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/hello-world" />} />
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
        path="/hacker-news"
        component={() => <Playground demo={hackerNews} />}
      />
      <Route render={() => <Redirect to="/hello-world" />} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
