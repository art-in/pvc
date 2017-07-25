'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (xmlstr) {
    return new _promise2.default(function (res, rej) {
        return parser.parseString(xmlstr, function (err, data) {
            if (err) {
                rej(err);
            }
            res(data);
        });
    });
};

var _xml2js = require('xml2js');

var _xml2js2 = _interopRequireDefault(_xml2js);

var _processors = require('xml2js/lib/processors.js');

var _processors2 = _interopRequireDefault(_processors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parser = new _xml2js2.default.Parser({
    mergeAttrs: true,
    explicitArray: false,
    valueProcessors: [_processors2.default.parseNumbers],
    attrValueProcessors: [_processors2.default.parseNumbers]
});

/**
 * Parses XML string
 * @param {string} xmlstr
 * @return {object} JS objects
 */