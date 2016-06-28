'use strict';
export function object(values, strict = false) {
  return {
    type: Object,
    values,
    strict
  };
};

export function array(values) {
  return {
    type: Array,
    values
  };
};

export function string(defaultValue) {
  return {
    type: String,
    'default': defaultValue,
  };
};

export function number(defaultValue) {
  return {
    type: Number,
    'default': defaultValue
  };
};
