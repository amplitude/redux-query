import React, { Component } from 'react';
import Inspector from 'react-inspector';
import styled from 'styled-components';

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;

  > li {
    padding: 4px 8px 2px;
  }
`;

const LogDivider = styled.hr`
  height: 1px;
  background-color: #ddd;
  border: 0;
  margin: 6px 0 4px 0;
  padding: 0 !important;
  flex-shrink: 0;
`;

// If within 10 pixels of max scrollTop, then pin to bottom
const pinScrollToBottomTolerance = 10;

class ReduxLog extends Component {
  _containerRef = null;
  _shouldPinScrollToBottom = false;

  setContainerRef = ref => {
    const previousRef = this._containerRef;

    this._containerRef = ref;

    if (!previousRef && this._containerRef) {
      this._containerRef.scrollTop = this._containerRef.scrollHeight -
        this._containerRef.offsetHeight;
    }
  };

  componentWillUpdate(nextProps) {
    const { props } = this;

    if (this._containerRef && props.messages !== nextProps.messages) {
      const { scrollTop, offsetHeight, scrollHeight } = this._containerRef;

      if (
        scrollTop + offsetHeight >= scrollHeight - pinScrollToBottomTolerance
      ) {
        this._shouldPinScrollToBottom = true;
      }
    }
  }

  componentDidUpdate() {
    if (this._shouldPinScrollToBottom && this._containerRef) {
      const { offsetHeight, scrollHeight } = this._containerRef;

      this._containerRef.scrollTop = scrollHeight - offsetHeight;
      this._shouldPinScrollToBottom = false;
    }
  }

  render() {
    const { props } = this;

    return (
      <Container innerRef={this.setContainerRef}>
        {props.messages.reduce(
          (accum, message, i, messages) => {
            accum.push(
              <Inspector
                key={`$prevState-${i}`}
                showNonenumerable={true}
                name="prev state"
                data={message.prevState}
                expandLevel={1}
              />
            );

            accum.push(
              <Inspector
                key={`$action-${i}`}
                showNonenumerable={true}
                name="action"
                data={message.action}
                expandLevel={1}
              />
            );

            accum.push(
              <Inspector
                key={`$nextState-${i}`}
                showNonenumerable={true}
                name={'next state'}
                data={message.nextState}
                expandLevel={1}
              />
            );

            if (i < messages.length - 1) {
              accum.push(<LogDivider key={`$divider-${i}`} />);
            }

            return accum;
          },
          []
        )}
      </Container>
    );
  }
}

export default ReduxLog;
