'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.createSanitizingReducer = createSanitizingReducer;

var _schema = require('./schema');

var Schema = _interopRequireWildcard(_schema);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var schema = exports.schema = Schema;

function createSanitizingReducer(rootSchema) {
  var previousState = {};

  // schema matcher
  function checkAgainstSchema(state, previousState, schema, path) {
    // if unchanged, return state transparently
    if (typeof previousState !== 'undefined' && state === previousState) {
      if (createSanitizingReducer.trackChanges) {
        console.log('[' + path + '] Returning state as is since equality check passes');
      }
      return state;
    }

    if (createSanitizingReducer.trackChanges) {
      console.log('[' + path + '] Sanitizing since equality check fails');
    }

    // if changed, do something..
    // 1. object sanitizing
    if (schema.type === Object) {
      var _ret2 = function () {
        // if 'allow-all' schema, return state as is
        if (typeof schema.values === 'undefined') return {
            v: state
          };

        // apply schema to children
        state = state || {};
        previousState = previousState || {};
        var dirtyState = {};

        // keys to loop over;
        // if schema.strict is true, only loop over what's defined in schema
        // essentially filtering out things that don't belong here
        var keys = schema.strict ? Object.keys(schema.values) : [].concat(_toConsumableArray(Object.keys(schema.values)), _toConsumableArray(Object.keys(state)));

        keys.forEach(function (key) {
          // if this is already processed, do nothing but return
          // this is here because I was lazy to implement a array.uniqueConcat()
          if (dirtyState.hasOwnProperty([key])) return;

          // go ahead!
          var targetLeaf = state[key];
          var previousLeaf = previousState[key];
          var schemaLeaf = schema.values[key];

          if (typeof schemaLeaf === 'undefined') {
            console.log('[' + path + '.' + key + '] This path is not registered in Schema. using state as is...');
            dirtyState[key] = targetLeaf;
          } else {
            dirtyState[key] = checkAgainstSchema(targetLeaf, previousLeaf, schemaLeaf, path + '.' + key);
          }
        });

        return {
          v: dirtyState
        };
      }();

      if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
    }

    // 2. array sanitizing
    else if (schema.type === Array) {
        // if 'allow-all' schema, return state as is
        if (typeof schema.values === 'undefined') return state;

        // apply schema to children
        state = state || [];
        previousState = previousState || [];
        return state.map(function (child, childIdx) {
          return checkAgainstSchema(child, previousState[childIdx], schema.values, path + '.' + childIdx);
        });
      }

      // 3. leaf defaulting
      else {
          var type = schema.type;
          var defaultValue = schema.default;
          var newState = type(state || defaultValue || type());
          if (createSanitizingReducer.trackChanges) {
            console.log('[' + path + '] Sanitizing leaf value', 'type=' + type.name, 'applied: ' + state + ' => ' + newState);
          }
          return newState;
        }
  }

  return function validatingReducer(state) {
    var _ret = checkAgainstSchema(state, previousState, rootSchema, '__root');
    previousState = _ret;
    return _ret;
  };
}

createSanitizingReducer.trackChanges = false;