import { mount } from 'enzyme';
import React from 'react';
import { expect } from 'chai';
import { omit } from 'lodash';
import sinon from 'sinon';

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
  dispatch: sinon.spy(params => new Promise(resolve => setTimeout(() => resolve(params), 1000))),
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
        expect(store.dispatch).have.callCount(0);
      },
      onComponentDidMount: () => {
        expect(store.dispatch).have.callCount(1);
        expect(store.dispatch.getCall(0)).have.been.calledWithMatch(
          createActionMatch({ force: false, type: '@@query/REQUEST_ASYNC' }),
        );
        done();
      },
    });
  });

  it('Should dispatch second request upon forcing', done => {
    const mounted = mountFooWithOneConfig(store, {
      onComponentDidMount: self => {
        expect(store.dispatch).have.callCount(1);
        expect(store.dispatch.getCall(0)).have.been.calledWithMatch(
          createActionMatch({ force: false, type: '@@query/REQUEST_ASYNC' }),
        );
        self.props.forceRequest();
        asap(() => {
          expect(store.dispatch.getCall(1)).have.been.calledWithMatch(
            createActionMatch({ force: true, retry: false, type: '@@query/REQUEST_ASYNC' }),
          );
          expect(store.dispatch).have.callCount(2);
          asap(() => mounted.unmount());
        });
      },
      onComponentWillUnmount: () => {
        expect(store.dispatch).have.callCount(3);
        expect(store.dispatch.getCall(2)).have.been.calledWithMatch({
          type: '@@query/CANCEL_QUERY',
        });
        done();
      },
    });
  });

  it('Should not re-request if query keys did not change', done => {
    const mounted = mountFooWithOneConfig(store, {
      onComponentDidMount: () => {
        expect(store.dispatch.getCall(0)).have.been.calledWithMatch(
          createActionMatch({ force: false, type: '@@query/REQUEST_ASYNC' }),
        );
        mounted.setProps({ foo: 'bar' }, () => {
          asap(() => {
            expect(store.dispatch).have.callCount(1);
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
            expect(store.dispatch).have.callCount(3);
            expect(store.dispatch.getCall(0)).have.been.calledWithMatch(
              createActionMatch({ force: false, type: '@@query/REQUEST_ASYNC' }),
            );
            expect(store.dispatch.getCall(1)).have.been.calledWithMatch({
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
            expect(store.dispatch).have.callCount(2);
            expect(store.dispatch.getCall(1)).have.been.calledWithMatch({
              type: '@@query/CANCEL_QUERY',
            });
            done();
          });
        });
      },
    });
  });

  it('Should return promise array from forceRequest', done => {
    const mounted = mountFoo(mapPropsToConfigs)(store, {
      onComponentDidMount: () => {
        const connectedComponent = mounted.find('ConnectRequest(Foo)').instance();
        const promises = connectedComponent.forceRequest();
        expect(promises.length).to.equal(1);
        expect(promises[0].then).to.be.a('function');
        done();
      },
    });
  });
});
