import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import Playground from './components/Playground';
import echo from './demos/echo';
import helloWorld from './demos/hello-world';

import './index.css';

const Main = styled.div`
    display: flex;
    flex-grow: 1;
`;

ReactDOM.render(
  <Router>
    <Main>
      <Route exact path="/" render={() => <Redirect to="/hello-world" />} />
      <Route
        path="/hello-world"
        render={() => <Playground demo={helloWorld} />}
      />
      <Route path="/echo" render={() => <Playground demo={echo} />} />
    </Main>
  </Router>,
  document.getElementById('root')
);
