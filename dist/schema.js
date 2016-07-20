'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.object = object;
exports.array = array;
exports.string = string;
exports.number = number;
exports.boolean = boolean;
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
  return schemaFactory({
    type: String,
    default: defaultValue
  });
}

function number(defaultValue) {
  return schemaFactory({
    type: Number,
    default: defaultValue
  });
}

function boolean(defaultValue) {
  return schemaFactory({
    type: Boolean,
    default: defaultValue
  });
}