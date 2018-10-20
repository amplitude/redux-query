import { mount } from 'enzyme';
import React from 'react';

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
    this.props.onRender && this.props.onRender(this);
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
  dispatch: jest.fn(params => new Promise(resolve => setTimeout(() => resolve(params), 1000))),
  subscribe: () => console.info('subscribe'),
  getState: () => console.info('getState'),
});

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

const mapPropsToConfigs = ({ url }) => ({ url: url || 'http://foo.bar' });

const mountFoo = (mapPropsToConfigs, options = {}) => (store, props) => {
  const Enhanced = connectRequest(mapPropsToConfigs, options)(Foo);
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
  queryKey: undefined,
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

  it('Should dispatch request upon mounting', done => {
    mountFooWithOneConfig(store, {
      onComponentWillMount: () => {
        expect(store.dispatch).toHaveBeenCalledTimes(0);
      },
      onComponentDidMount: () => {
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch.mock.calls[0][0]).toMatchObject(
          createActionMatch({ force: false, type: '@@query/REQUEST_ASYNC' }),
        );
        done();
      },
    });
  });

  it('Should dispatch second request upon forcing', done => {
    const mounted = mountFooWithOneConfig(store, {
      onComponentDidMount: self => {
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch.mock.calls[0][0]).toMatchObject(
          createActionMatch({ force: false, type: '@@query/REQUEST_ASYNC' }),
        );
        self.props.forceRequest();
        asap(() => {
          expect(store.dispatch.mock.calls[1][0]).toMatchObject(
            createActionMatch({ force: true, retry: false, type: '@@query/REQUEST_ASYNC' }),
          );
          expect(store.dispatch).toHaveBeenCalledTimes(2);
          asap(() => mounted.unmount());
        });
      },
      onComponentWillUnmount: () => {
        expect(store.dispatch).toHaveBeenCalledTimes(3);
        expect(store.dispatch.mock.calls[2][0]).toMatchObject({
          type: '@@query/CANCEL_QUERY',
        });
        done();
      },
    });
  });

  it('Should not re-request if query keys did not change', done => {
    const mounted = mountFooWithOneConfig(store, {
      onComponentDidMount: () => {
        expect(store.dispatch.mock.calls[0][0]).toMatchObject(
          createActionMatch({ force: false, type: '@@query/REQUEST_ASYNC' }),
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

  it('Should re-request if query keys did change', done => {
    const mounted = mountFooWithOneConfig(store, {
      onComponentDidMount: () => {
        mounted.setProps({ url: 'http://foo2.bar' }, () => {
          asap(() => {
            expect(store.dispatch).toHaveBeenCalledTimes(3);
            expect(store.dispatch.mock.calls[0][0]).toMatchObject(
              createActionMatch({ force: false, type: '@@query/REQUEST_ASYNC' }),
            );
            expect(store.dispatch.mock.calls[1][0]).toMatchObject({
              type: '@@query/CANCEL_QUERY',
            });
            done();
          });
        });
      },
    });
  });

  it('Should just cancel if there are no queries after update', done => {
    const mapPropsToConfigs = ({ empty }) => (empty ? {} : { url: 'http://foo.bar' });
    const mounted = mountFoo(mapPropsToConfigs)(store, {
      onComponentDidMount: () => {
        mounted.setProps({ empty: true }, () => {
          asap(() => {
            expect(store.dispatch).toHaveBeenCalledTimes(2);
            expect(store.dispatch.mock.calls[1][0]).toMatchObject({
              type: '@@query/CANCEL_QUERY',
            });
            done();
          });
        });
      },
    });
  });

  it('Should return and resolve a promise from forceRequest and resolve them all', done => {
    const actions = [];
    const store = {
      dispatch: action => actions.push(action),
      subscribe: () => undefined,
      getState: () => undefined,
    };
    const spy = jest.fn();
    const mounted = mountFoo(mapPropsToConfigs)(store, {
      onComponentDidMount: () => {
        const connectedComponent = mounted.find('ConnectRequest(Foo)').instance();
        const promise = connectedComponent.forceRequest();
        const promise2 = connectedComponent.forceRequest();
        expect(typeof promise.then).toBe('function');
        promise.then(() => {
          spy();
          connectedComponent.forceRequest().then(() => {
            expect(spy.mock.calls.length).toBe(2);
            expect(connectedComponent._resolvers.length).toBe(0);
            done();
          });
          actions.pop().unstable_preDispatchCallback();
        });
        promise2.then(() => {
          spy();
        });
        actions.pop().unstable_preDispatchCallback();
      },
    });
  });

  describe('withRef', () => {
    it('should store the wrapped instance if withRef is passed', () => {
      const mounted = mountFoo(mapPropsToConfigs, { withRef: true })(store);
      const connected = mounted.find('ConnectRequest(Foo)').instance();
      expect(typeof connected.getWrappedInstance()).toBe('object');
    });

    it('should not store the wrapped instance if withRef is not passed', () => {
      const mounted = mountFoo(mapPropsToConfigs)(store);
      const connected = mounted.find('ConnectRequest(Foo)').instance();
      expect(connected.getWrappedInstance()).toBeNull();
    });
  });

  describe('pure', () => {
    it('behave like pure if its pure', () => {
      const onRender = jest.fn();
      const mounted = mountFoo(mapPropsToConfigs, { pure: true })(store, { onRender, foo: 'bar' });
      expect(onRender).toHaveBeenCalled();
      mounted.setProps({ foo: 'bar' });
      expect(onRender).toHaveBeenCalledTimes(1);
      mounted.setProps({ foo: 'bar2' });
      expect(onRender).toHaveBeenCalledTimes(2);
    });

    it('behave like a non-pure if it is not pure', () => {
      const onRender = jest.fn();
      const mounted = mountFoo(mapPropsToConfigs, { pure: false })(store, { onRender, foo: 'bar' });
      expect(onRender).toHaveBeenCalled();
      mounted.setProps({ foo: 'bar' });
      expect(onRender).toHaveBeenCalledTimes(2);
      mounted.setProps({ foo: 'bar2' });
      expect(onRender).toHaveBeenCalledTimes(3);
    });
  });

  describe('displayName', () => {
    it('should be ConnectRequest(<componentName>)', () => {
      const mounted = mountFoo(mapPropsToConfigs)(store);
      expect(mounted.childAt(0).name()).toBe('ConnectRequest(Foo)');
    });
  });
});
