import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { connectRequest } from 'redux-query';

const helloQuery = () => ({
  url: '/api/hello',
  update: {
    message: (prev, next) => next,
  },
});

class HelloWorld extends Component {
  render() {
    return (
      <h1>
        {this.props.message ?
          <span>Hello, {this.props.message}!</span>
          :
          <span>Hello?</span>
        }
      </h1>
    );
  }
}

const mapStateToProps = (state) => ({
  message: state.entities.message,
});

const HelloWorldContainer = compose(
  connect(mapStateToProps),
  connectRequest(() => helloQuery())
)(HelloWorld);

class App extends Component {
  render() {
    return (
      <HelloWorldContainer />
    );
  }
}

export default App;
