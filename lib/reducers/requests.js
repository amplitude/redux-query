'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _values = require('lodash/values');

var _values2 = _interopRequireDefault(_values);

var _includes = require('lodash/includes');

var _includes2 = _interopRequireDefault(_includes);

var _actionTypes = require('../constants/action-types');

var actionTypes = _interopRequireWildcard(_actionTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var request = function request() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? { status: null, isPending: false, lastUpdated: null } : arguments[0];
    var action = arguments[1];

    return _extends({}, state, {
        status: action.status || state.status,
        isPending: action.type === actionTypes.REQUEST_START,
        lastUpdated: action.type !== actionTypes.REQUEST_START ? action.time : state.lastUpdated
    });
};

var requests = function requests() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments[1];

    if ((0, _includes2.default)((0, _values2.default)(actionTypes), action.type)) {
        return _extends({}, state, _defineProperty({}, action.url, request(state[action.url], action)));
    } else {
        return state;
    }
};

exports.default = requests;