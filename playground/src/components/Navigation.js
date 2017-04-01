import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const width = 200;

const Container = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  width: ${width}px;
`;

const FixedContainer = styled.div`
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${width}px;
  background-color: whitesmoke;
  border-right: 1px solid #ccc;
  padding: 12px;
`;

const Section = styled.div`
  margin: 0;
  padding: 8px 0;
`;

const SectionTitle = styled.div`
  font-size: 13px;
  text-transform: uppercase;
  font-weight: 600;
  padding: 8px 0;
  color: #333;
`;

const Item = styled(NavLink)`
  display: flex;
  font-size: 14px;
  flex-grow: 1;
  text-decoration: none;
  color: #666;
  padding: 8px 0;

  &:hover {
    text-decoration: underline;
  }

  &.${props => props.activeClassName} {
    color: #27d;
  }
`;

Item.defaultProps = {
  activeClassName: 'active',
};

const ProjectTitle = styled.h1`
  color: #222;
  margin: 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #ccc;
  font-size: 18px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 500;
`;

class Navigation extends Component {
  render() {
    return (
      <Container>
        <FixedContainer>
          <ProjectTitle>
            redux-query
          </ProjectTitle>
          <Section>
            <SectionTitle>Docs</SectionTitle>
            <Item to="/" exact={true}>
              Read Me
            </Item>
            <Item to="/changelog">
              Change Log
            </Item>
          </Section>
          <Section>
            <SectionTitle>Demos</SectionTitle>
            <Item to="/hello-world">
              Hello World
            </Item>
            <Item to="/mounting">
              Mounting and Unmounting
            </Item>
            <Item to="/updating">
              Updating from Props
            </Item>
            <Item to="/mutations">
              Mutations
            </Item>
            <Item to="/redux-saga">
              Usage with redux-saga
            </Item>
            <Item to="/hacker-news">
              Hacker News
            </Item>
          </Section>
        </FixedContainer>
      </Container>
    );
  }
}

export default Navigation;
