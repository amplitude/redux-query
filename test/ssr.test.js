import React from 'react';
import superagent from 'superagent';
import superagentMock from 'superagent-mock';
import { renderToStringWithData } from '../src/ssr';
import connectRequest from '../src/components/connect-request';
import StoreShape from '../src/lib/store-shape';
import * as actionTypes from '../src/constants/action-types';

const data = 'Hello, world';

class StoreProvider extends React.Component {
  getChildContext() {
    return {
      store: this.props.store,
    };
  }
  render() {
    /* eslint-disable-next-line */
    const { store, children, ...props } = this.props;
    return React.cloneElement(children, props);
  }
}

StoreProvider.childContextTypes = {
  store: StoreShape,
};

const superagentMockConfig = [
  {
    pattern: '/foo',
    fixtures: () => {
      return data;
    },
    get: () => ({
      body: { foo: 'bar' },
      status: 200,
      ok: true,
    }),
  },
  {
    pattern: '/bar',
    fixtures: () => {
      return data;
    },
    get: () => ({
      body: { bar: 'foo' },
      status: 200,
      ok: true,
    }),
  },
];

superagentMock(superagent, superagentMockConfig);
const Foo = ({ foo, children }) => (
  <div className="foo">
    {foo}
    {children}
  </div>
);
const Bar = ({ bar }) => <div className="bar">{bar}</div>;

const requestConfigFactories = {
  foo: () => ({
    url: 'http://localhost/foo',
    update: {
      foo: foo => foo,
    },
  }),
  bar: () => ({
    url: 'http://localhost/bar',
    update: {
      foo: bar => bar,
    },
  }),
};

const FooConnected = connectRequest(requestConfigFactories.foo)(Foo);
const BarConnected = connectRequest(requestConfigFactories.bar)(Bar);

describe('ssr', () => {
  it('renderToStringWithData', done => {
    const dispatch = jest.fn(action => {
      expect(action.type === actionTypes.REQUEST_START);
      setTimeout(() => {
        action.unstable_preDispatchCallback();
      }, 0);
    });
    const store = {
      dispatch,
      subscribe: jest.fn(),
      getState: jest.fn(),
    };
    const element = (
      <StoreProvider store={store}>
        <React.Fragment>
          <FooConnected>
            <FooConnected />
          </FooConnected>
          <BarConnected />
        </React.Fragment>
      </StoreProvider>
    );
    const almostDone = () => {
      expect(dispatch).toHaveBeenCalledTimes(3);
      done();
    };
    renderToStringWithData(element).then(almostDone);
  });
});
