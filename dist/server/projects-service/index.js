'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getProjects = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * Gets projects from service
 * @return {object}
 */
var getProjects = exports.getProjects = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var _config$projectsServi, defaultUrl, path, response, contentType, data, xml;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _config$projectsServi = _config2.default.projectsService, defaultUrl = _config$projectsServi.defaultUrl, path = _config$projectsServi.path;

                        // 'content-type: application/json' does not take effect on service
                        // 'application/xml' received anyway

                        _context.next = 3;
                        return (0, _nodeFetch2.default)('' + defaultUrl + path);

                    case 3:
                        response = _context.sent;
                        contentType = response.headers.get('content-type');
                        data = void 0;
                        _context.t0 = contentType;
                        _context.next = _context.t0 === 'application/xml' ? 9 : 16;
                        break;

                    case 9:
                        _context.next = 11;
                        return response.text();

                    case 11:
                        xml = _context.sent;
                        _context.next = 14;
                        return parseAndNormalizeXml(xml);

                    case 14:
                        data = _context.sent;
                        return _context.abrupt('break', 17);

                    case 16:
                        throw Error('Unknown content type of response: "' + contentType + '"');

                    case 17:

                        validateProjectsResponse(data);

                        return _context.abrupt('return', data);

                    case 19:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function getProjects() {
        return _ref.apply(this, arguments);
    };
}();

/**
 * Parses and normalizes projects XML
 * @param {string} xml - projects XML
 * @return {object}
 */


var parseAndNormalizeXml = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(xml) {
        var data;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return (0, _xmlParser2.default)(xml);

                    case 2:
                        data = _context2.sent;


                        // normalize
                        data.projects.project = Array.isArray(data.projects.project) ? data.projects.project : [data.projects.project];

                        data.projects.project.forEach(function (p) {
                            return p.buildTypes.buildType = Array.isArray(p.buildTypes.buildType) ? p.buildTypes.buildType : [p.buildTypes.buildType];
                        });

                        return _context2.abrupt('return', data);

                    case 6:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function parseAndNormalizeXml(_x) {
        return _ref2.apply(this, arguments);
    };
}();

/**
 * Validates projects object schema
 * @param {object} data
 */


var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _xmlParser = require('../utils/xml-parser');

var _xmlParser2 = _interopRequireDefault(_xmlParser);

var _config = require('../../../config');

var _config2 = _interopRequireDefault(_config);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _checkPropTypes = require('check-prop-types');

var _checkPropTypes2 = _interopRequireDefault(_checkPropTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validateProjectsResponse(data) {

    var stringOrNumber = _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]);

    var schema = {
        projects: _propTypes2.default.shape({
            project: _propTypes2.default.arrayOf(_propTypes2.default.shape({
                id: stringOrNumber.isRequired,
                name: stringOrNumber.isRequired,
                buildTypes: _propTypes2.default.shape({
                    buildType: _propTypes2.default.arrayOf(_propTypes2.default.shape({
                        id: stringOrNumber.isRequired,
                        name: stringOrNumber.isRequired
                    }))
                })
            }))
        }).isRequired
    };

    var error = (0, _checkPropTypes2.default)(schema, data, null, 'projects service response');

    if (error) {
        throw Error(error);
    }
}