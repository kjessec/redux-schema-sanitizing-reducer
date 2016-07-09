'use strict';
import * as Schema from './schema';
import { stateCompose } from './util';
import sanitize from './sanitize';

export const schema = Schema;
export function createSanitizingReducer(rootSchema) {
  let previousState = {};

  return function sanitizingReducer(state) {
    // future-proof compose functionality
    const _ret = stateCompose(
      sanitize
    )(state, previousState, rootSchema, '__root');

    previousState = _ret;
    return _ret;
  };
}

createSanitizingReducer.trackChanges = false;
