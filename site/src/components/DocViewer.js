import marked from 'marked';
import React, { Component } from 'react';
import styled from 'styled-components';

import 'github-markdown-css/github-markdown.css';

import CoreLayout from './CoreLayout';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 12px;
`;

class DocViewer extends Component {
  state = {
    content: null,
  };

  componentDidMount() {
    const { props } = this;

    if (props.doc.indexOf('data:') === 0) {
      this.setState({
        content: atob(props.doc.split(';base64,')[1]),
      });
    } else {
      fetch(props.doc)
        .then(resp => resp.text())
        .then(data => {
          this.setState({
            content: data,
          });
        });
    }

    window.amplitude.getInstance().logEvent(`view ${props.name}`);
  }

  render() {
    const { state } = this;

    return (
      <CoreLayout>
        <Container>
          {!!state.content && (
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: marked(state.content) }}
            />
          )}
        </Container>
      </CoreLayout>
    );
  }
}

export default DocViewer;
