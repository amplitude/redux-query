'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _identity = require('lodash/identity');

var _identity2 = _interopRequireDefault(_identity);

var _actions = require('../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createMutatingAction = function createMutatingAction(mapArgsToUrl, mapArgsToTransform) {
    return function (args) {
        return function (dispatch) {
            var url = mapArgsToUrl(args);
            var transform = mapArgsToTransform ? mapArgsToTransform(args) : _identity2.default;
            dispatch((0, _actions.mutateAsync)(url, transform));
        };
    };
};

exports.default = createMutatingAction;