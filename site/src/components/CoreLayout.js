import React, { Component } from 'react';
import styled from 'styled-components';

import Navigation from './Navigation';

const Container = styled.div`
  display: flex;
  flex-grow: 1;

  ${props => (props.disableBodyScroll ? 'height' : 'min-height')}: 100vh;
  ${props => props.disableBodyScroll && 'max-width: 100vw;'};
  ${props => props.disableBodyScroll && 'overflow-x: hidden;'};

  min-width: 960px;
  align-items: stretch;
  justify-content: center;
  background-color: #eee;
`;

const Main = styled.div`
  display: flex;
  flex-grow: 1;
  background-color: white;

  ${props => props.disableBodyScroll && 'overflow: hidden;'};
`;

class CoreLayout extends Component {
  render() {
    const { props } = this;

    return (
      <Container disableBodyScroll={props.disableBodyScroll}>
        <Navigation />
        <Main disableBodyScroll={props.disableBodyScroll}>
          {this.props.children}
        </Main>
      </Container>
    );
  }
}

export default CoreLayout;
