import { mount } from 'enzyme';
import React from 'react';
import { omit } from 'lodash';

import StoreShape from '../../src/lib/store-shape';
import connectRequest from '../../src/components/connect-request';

const asap = callback => setTimeout(callback, 0);

class Foo extends React.Component {
  componentWillMount() {
    this.props.onComponentWillMount(this);
  }
  componentDidMount() {
    asap(() => this.props.onComponentDidMount(this));
  }
  componentWillUnmount() {
    asap(() => this.props.onComponentWillUnmount(this));
  }
  render() {
    return '';
  }
}
const noop = () => undefined;

Foo.defaultProps = {
  onComponentDidMount: noop,
  onComponentWillMount: noop,
  onComponentWillUnmount: noop,
};

const createStore = () => ({
  dispatch: jest.fn(),
  subscribe: () => jest.fn(),
  getState: () => jest.fn(),
});

class StoreProvider extends React.Component {
  getChildContext() {
    return {
      store: this.props.store,
    };
  }
  render() {
    return React.cloneElement(this.props.children, omit(this.props, 'store'));
  }
}

StoreProvider.childContextTypes = {
  store: StoreShape,
};

const mapPropsToConfigs = ({ url }) => ({ url: url || 'http://foo.bar' });

const mountFoo = mapPropsToConfigs => (store, props) => {
  const Enhanced = connectRequest(mapPropsToConfigs)(Foo);
  return mount(
    <StoreProvider store={store}>
      <Enhanced {...props} />
    </StoreProvider>,
  );
};

const mountFooWithOneConfig = mountFoo(mapPropsToConfigs);

const createActionMatch = (params = {}) => ({
  body: undefined,
  force: false,
  meta: undefined,
  options: undefined,
  retry: true,
  transform: undefined,
  type: '@@query/REQUEST_ASYNC',
  update: undefined,
  url: 'http://foo.bar',
  ...params,
});

describe('connectRequest', () => {
  let store;
  beforeEach(() => {
    store = createStore();
  });

  test('Should dispatch request upon mounting', done => {
    mountFooWithOneConfig(store, {
      onComponentWillMount: () => {
        expect(store.dispatch).toHaveBeenCalledTimes(0);
      },
      onComponentDidMount: () => {
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining(
            createActionMatch({ force: false, type: '@@query/REQUEST_ASYNC' }),
          ),
        );
        done();
      },
    });
  });

  test('Should dispatch second request upon forcing', done => {
    store.dispatch.mockReturnValue(Promise.resolve());
    const mounted = mountFooWithOneConfig(store, {
      onComponentDidMount: self => {
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining(
            createActionMatch({ force: false, type: '@@query/REQUEST_ASYNC' }),
          ),
        );
        self.props.forceRequest();
        asap(() => {
          expect(store.dispatch).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining(
              createActionMatch({ force: true, retry: false, type: '@@query/REQUEST_ASYNC' }),
            ),
          );
          expect(store.dispatch).toHaveBeenCalledTimes(2);
          asap(() => mounted.unmount());
        });
      },
      onComponentWillUnmount: () => {
        expect(store.dispatch).toHaveBeenCalledTimes(3);
        expect(store.dispatch).toHaveBeenNthCalledWith(
          3,
          expect.objectContaining({
            type: '@@query/CANCEL_QUERY',
          }),
        );
        done();
      },
    });
  });

  test('Should not re-request if query keys did not change', done => {
    const mounted = mountFooWithOneConfig(store, {
      onComponentDidMount: () => {
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining(
            createActionMatch({ force: false, type: '@@query/REQUEST_ASYNC' }),
          ),
        );
        mounted.setProps({ foo: 'bar' }, () => {
          asap(() => {
            expect(store.dispatch).toHaveBeenCalledTimes(1);
            done();
          });
        });
      },
    });
  });

  test('Should re-request if query keys did change', done => {
    store.dispatch.mockReturnValue(Promise.resolve());
    const mounted = mountFooWithOneConfig(store, {
      onComponentDidMount: () => {
        mounted.setProps({ url: 'http://foo2.bar' }, () => {
          asap(() => {
            expect(store.dispatch).toHaveBeenCalledTimes(3);
            expect(store.dispatch).toHaveBeenNthCalledWith(
              3,
              expect.objectContaining(
                createActionMatch({
                  force: false,
                  type: '@@query/REQUEST_ASYNC',
                  url: 'http://foo2.bar',
                }),
              ),
            );
            expect(store.dispatch).toHaveBeenNthCalledWith(
              2,
              expect.objectContaining({
                type: '@@query/CANCEL_QUERY',
              }),
            );
            done();
          });
        });
      },
    });
  });

  test('Should just cancel if there are no queries after update', done => {
    const mapPropsToConfigs = ({ empty }) => (empty ? {} : { url: 'http://foo.bar' });
    store.dispatch.mockReturnValue(Promise.resolve());
    const mounted = mountFoo(mapPropsToConfigs)(store, {
      onComponentDidMount: () => {
        mounted.setProps({ empty: true }, () => {
          asap(() => {
            expect(store.dispatch).toHaveBeenCalledTimes(2);
            expect(store.dispatch).toHaveBeenNthCalledWith(
              2,
              expect.objectContaining({
                type: '@@query/CANCEL_QUERY',
              }),
            );
            done();
          });
        });
      },
    });
  });

  test('Should return promise array from forceRequest', done => {
    store.dispatch.mockReturnValue(Promise.resolve());
    const mounted = mountFoo(mapPropsToConfigs)(store, {
      onComponentDidMount: () => {
        const connectedComponent = mounted.find('ConnectRequest(Foo)').instance();
        const promises = connectedComponent.forceRequest();
        console.info(promises);
        expect(promises.length).toBe(1);
        expect(typeof promises[0].then).toBe('function');
        done();
      },
    });
  });
});
