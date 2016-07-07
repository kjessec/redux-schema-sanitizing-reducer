'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stateCompose = stateCompose;
exports.isObject = isObject;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function stateCompose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  var first = funcs[0];
  var rest = funcs.slice(1);

  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return rest.reduce(function (state, f) {
      return f.apply(undefined, [state].concat(_toConsumableArray(args.slice(1))));
    }, first.apply(undefined, args));
  };
}

function isObject(obj) {
  return obj === Object(obj);
}

var isArray = exports.isArray = Array.isArray;