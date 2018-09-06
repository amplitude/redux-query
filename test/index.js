import 'raf/polyfill';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

sinon.assert.expose(chai.assert, { prefix: '' });

chai.should();
chai.use(sinonChai);

Enzyme.configure({ adapter: new Adapter() });
