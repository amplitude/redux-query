'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _identity = require('lodash/identity');

var _identity2 = _interopRequireDefault(_identity);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _storeShape = require('react-redux/lib/utils/storeShape');

var _storeShape2 = _interopRequireDefault(_storeShape);

var _partial = require('lodash/partial');

var _partial2 = _interopRequireDefault(_partial);

var _actions = require('../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var createContainer = function createContainer(mapPropsToUrl, mapStateToRequests, mapPropsToTransform) {
    return function (WrappedComponent) {
        var ReduxQueryContainer = function (_Component) {
            _inherits(ReduxQueryContainer, _Component);

            function ReduxQueryContainer() {
                _classCallCheck(this, ReduxQueryContainer);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(ReduxQueryContainer).apply(this, arguments));
            }

            _createClass(ReduxQueryContainer, [{
                key: 'componentDidMount',
                value: function componentDidMount() {
                    this.fetch(this.props);
                }
            }, {
                key: 'componentWillUpdate',
                value: function componentWillUpdate(nextProps) {
                    this.fetch(nextProps);
                }
            }, {
                key: 'fetch',
                value: function fetch(props) {
                    var force = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
                    var dispatch = this.context.store.dispatch;

                    var url = mapPropsToUrl(props);
                    var transform = mapPropsToTransform ? mapPropsToTransform(props) : _identity2.default;
                    dispatch((0, _actions.requestAsync)(url, mapStateToRequests, transform, force));
                }
            }, {
                key: 'render',
                value: function render() {
                    return _react2.default.createElement(WrappedComponent, _extends({}, this.props, {
                        forceRequest: (0, _partial2.default)(this.fetch.bind(this), this.props, true)
                    }));
                }
            }]);

            return ReduxQueryContainer;
        }(_react.Component);

        ReduxQueryContainer.displayName = 'ReduxQueryContainer(' + WrappedComponent.displayName + ')';
        ReduxQueryContainer.contextTypes = {
            store: _storeShape2.default
        };

        return ReduxQueryContainer;
    };
};

exports.default = createContainer;