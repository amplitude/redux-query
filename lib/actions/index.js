'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mutateAsync = exports.requestAsync = exports.mutateFailure = exports.mutateSuccess = exports.mutateStart = exports.requestFailure = exports.requestSuccess = exports.requestStart = undefined;

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _actionTypes = require('../constants/action-types');

var actionTypes = _interopRequireWildcard(_actionTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requestStart = exports.requestStart = function requestStart(url) {
    return {
        type: actionTypes.REQUEST_START,
        url: url
    };
};

var requestSuccess = exports.requestSuccess = function requestSuccess(url, status, entities) {
    return {
        type: actionTypes.REQUEST_SUCCCESS,
        url: url,
        status: status,
        entities: entities,
        time: Date.now()
    };
};

var requestFailure = exports.requestFailure = function requestFailure(url, status) {
    return {
        type: actionTypes.REQUEST_FAILURE,
        url: url,
        status: status,
        time: Date.now()
    };
};

var mutateStart = exports.mutateStart = function mutateStart(url) {
    return {
        type: actionTypes.MUTATE_START,
        url: url
    };
};

var mutateSuccess = exports.mutateSuccess = function mutateSuccess(url, status, entities) {
    return {
        type: actionTypes.MUTATE_SUCCESS,
        url: url,
        status: status,
        entities: entities,
        time: Date.now()
    };
};

var mutateFailure = exports.mutateFailure = function mutateFailure(url, status) {
    return {
        type: actionTypes.MUTATE_FAILURE,
        url: url,
        status: status,
        time: Date.now()
    };
};

var requestAsync = exports.requestAsync = function requestAsync(url, requestsSelector, transform, force) {
    return function (dispatch, getState) {
        var state = getState();
        var requests = requestsSelector(state);
        var request = requests[url];
        var isPending = (0, _get2.default)(request, ['isPending'], false);
        var status = (0, _get2.default)(request, ['status']);
        var hasSucceeded = status >= 200 && status < 300;

        if (force || !isPending && !hasSucceeded) {
            dispatch(requestStart(url));

            _superagent2.default.get(url).end(function (err, response) {
                if (err) {
                    dispatch(requestFailure(url, response.status));
                } else {
                    var transformed = transform(response.body);
                    dispatch(requestSuccess(url, response.status, transformed));
                }
            });
        }
    };
};

var mutateAsync = exports.mutateAsync = function mutateAsync(url, transform) {
    return function (dispatch, getState) {
        var state = getState();

        dispatch(mutateStart(url));

        _superagent2.default.post(url).end(function (err, response) {
            if (err) {
                dispatch(mutateFailure(url, response.status));
            } else {
                var transformed = transform(response.body);
                dispatch(mutateSuccess(url, response.status, transformed));
            }
        });
    };
};