import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import Playground from './components/Playground';
import cancelOnUnmount from './demos/cancel-on-unmount';
import cancelOnUpdate from './demos/cancel-on-update';
import helloWorld from './demos/hello-world';

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
        path="/cancel-on-update"
        component={() => <Playground demo={cancelOnUpdate} />}
      />
      <Route
        path="/cancel-on-unmount"
        component={() => <Playground demo={cancelOnUnmount} />}
      />
      <Route render={() => <Redirect to="/hello-world" />} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
