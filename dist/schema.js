'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.object = object;
exports.array = array;
exports.string = string;
exports.number = number;
exports.boolean = boolean;
var identity = function identity(x) {
  return x;
};

function schemaFactory(schema) {
  return schema; // TBD
}

function object(values) {
  var strict = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  return schemaFactory({
    type: Object,
    values: values,
    strict: strict
  });
}

function array(values) {
  return schemaFactory({
    type: Array,
    values: values
  });
}

function string(defaultValue) {
  var transform = arguments.length <= 1 || arguments[1] === undefined ? identity : arguments[1];

  return schemaFactory({
    type: String,
    defaultValue: defaultValue,
    transform: transform
  });
}

function number(defaultValue) {
  var transform = arguments.length <= 1 || arguments[1] === undefined ? identity : arguments[1];

  return schemaFactory({
    type: Number,
    defaultValue: defaultValue,
    transform: transform
  });
}

function boolean(defaultValue) {
  var transform = arguments.length <= 1 || arguments[1] === undefined ? identity : arguments[1];

  return schemaFactory({
    type: Boolean,
    defaultValue: defaultValue,
    transform: transform
  });
}