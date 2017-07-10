const Schema = require('./schema');
const sanitize = require('./sanitize');
const { stateCompose } = require('./util');

exports.schema = Schema;
exports.createSanitizingReducer = function createSanitizingReducer(rootSchema) {
  let previousState = {};

  return function sanitizingReducer(state) {
    // future-proof compose functionality
    const _ret = stateCompose(
      sanitize
    )(state, previousState, rootSchema, '__root');

    previousState = _ret;
    return _ret;
  };
};
