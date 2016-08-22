'use strict';
const identity = x => x;

function schemaFactory(schema) {
  return schema; // TBD
}

export function object(values, strict = false) {
  return schemaFactory({
    type: Object,
    values,
    strict,
  });
}

export function array(values) {
  return schemaFactory({
    type: Array,
    values,
  });
}

export function string(defaultValue, transform = identity) {
  return schemaFactory({
    type: String,
    defaultValue,
    transform,
  });
}

export function number(defaultValue, transform = identity) {
  return schemaFactory({
    type: Number,
    defaultValue,
    transform,
  });
}

export function boolean(defaultValue, transform = identity) {
  return schemaFactory({
    type: Boolean,
    defaultValue,
    transform,
  });
}
