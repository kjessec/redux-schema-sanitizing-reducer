const identity = x => x;

function schemaFactory(schema) {
  return schema; // TBD
}

exports.object = function object(values, strict = false) {
  return schemaFactory({
    type: Object,
    values,
    strict,
  });
}

exports.array = function array(values) {
  return schemaFactory({
    type: Array,
    values,
  });
}

exports.string = function string(defaultValue = '', transform = identity) {
  return schemaFactory({
    type: String,
    defaultValue,
    transform,
  });
}

exports.number = function number(defaultValue = 0, transform = identity) {
  return schemaFactory({
    type: Number,
    defaultValue,
    transform,
  });
}

exports.boolean = function boolean(defaultValue = true, transform = identity) {
  return schemaFactory({
    type: Boolean,
    defaultValue,
    transform,
  });
}
