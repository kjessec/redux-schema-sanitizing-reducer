'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.object = object;
exports.array = array;
exports.string = string;
exports.number = number;
function object(values) {
  var strict = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  return {
    type: Object,
    values: values,
    strict: strict
  };
};

function array(values) {
  return {
    type: Array,
    values: values
  };
};

function string(defaultValue) {
  return {
    type: String,
    'default': defaultValue
  };
};

function number(defaultValue) {
  return {
    type: Number,
    'default': defaultValue
  };
};