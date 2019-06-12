// @flow

import * as React from 'react';

import connectRequest from '../../src/components/connect-request';

type Props = {
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

const mapPropsToConfigs = () => {
  return {
    url: '/api',
  };
};

const ConnectedCard = connectRequest<React.Config<Props, DefaultProps>>(mapPropsToConfigs)(Card);

const App = () => {
  return <ConnectedCard />;
};
