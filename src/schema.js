'use strict';
function schemaFactory(schema) {
  return schema; // TBD
}

export function object(values, strict = false) {
  return schemaFactory({
    type: Object,
    values,
    strict
  });
};

export function array(values) {
  return schemaFactory({
    type: Array,
    values,
  });
};

export function string(defaultValue) {
  return schemaFactory({
    type: String,
    'default': defaultValue
  });
};

export function number(defaultValue) {
  return schemaFactory({
    type: Number,
    'default': defaultValue
  });
};

export function boolean(defaultValue) {
  return schemaFactory({
    type: Boolean,
    'default': defaultValue
  })
};

export function ref(refId) {
  return schemaFactory({
    type: '__ref',
    ref: refId
  });
}
