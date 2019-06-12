// @flow

import * as React from 'react';

import connectRequest from '../../src/components/connect-request';

type Props = {
  url: string,
  forceRequest: () => void,
  title: string,
};

type DefaultProps = {
  title: string,
};

class Card extends React.Component<Props> {
  static defaultProps: DefaultProps = {
    title: 'hi',
  };

  render() {
    return <div>{this.props.title}</div>;
  }
}

const mapPropsToConfigs = props => {
  return {
    url: props.url,
  };
};

const ConnectedCard = connectRequest<React.Config<Props, DefaultProps>>(mapPropsToConfigs)(Card);

export const App = () => {
  return <ConnectedCard url="/api" />;
};
