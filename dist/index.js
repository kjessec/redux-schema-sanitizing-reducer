'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = undefined;
exports.createSanitizingReducer = createSanitizingReducer;

var _schema = require('./schema');

var Schema = _interopRequireWildcard(_schema);

var _util = require('./util');

var _sanitize = require('./sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var schema = exports.schema = Schema;
function createSanitizingReducer(rootSchema) {
  var previousState = {};

  return function sanitizingReducer(state) {
    // future-proof compose functionality
    var _ret = (0, _util.stateCompose)(_sanitize2.default)(state, previousState, rootSchema, '__root');

    previousState = _ret;
    return _ret;
  };
}

createSanitizingReducer.trackChanges = false;