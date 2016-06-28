'use strict';
import * as Schema from './schema';
import omnimap from 'omnimap';
export const schema = Schema;

createSanitizingReducer.trackChanges = false;
export function createSanitizingReducer(rootSchema) {
  let previousState = {};

  // schema matcher
  function checkAgainstSchema(state, previousState, schema, path) {
    // if unchanged, return state transparently
    if(previousState && state === previousState) {
      if(createSanitizingReducer.trackChanges) {
        console.log(`[${path}] Returning state as is since equality check passes`);
      }
      return state;
    }

    // if changed, do something..
    // 1. object sanitizing
    if(schema.type === Object) {
      previousState = previousState || {};
      const dirtyState = {};

      // keys to loop over;
      // if schema.strict is true, only loop over what's defined in schema
      // essentially filtering out things that don't belong here
      const keys = schema.strict
          ? Object.keys(schema.values)
          : [...Object.keys(schema.values), ...Object.keys(state)];

      keys.forEach(key => {
        // if this is already processed, do nothing but return
        // this is here because I was lazy to implement a array.uniqueConcat()
        if(dirtyState.hasOwnProperty([key])) return;

        // go ahead!
        const targetLeaf = state[key];
        const previousLeaf = previousState[key];
        const schemaLeaf = schema.values[key];

        if(typeof schemaLeaf === 'undefined') {
          console.log(`[${path}.${key}] This path is not registered in Schema. using state as is...`);
          dirtyState[key] = targetLeaf;
        } else {
          dirtyState[key] = checkAgainstSchema(targetLeaf, previousLeaf, schemaLeaf, `${path}.${key}`);
        }
      });

      return dirtyState;
    }

    // 2. array sanitizing
    else if(schema.type === Array) {
      previousState = previousState || [];
      return state.map(function(child, childIdx) {
        return checkAgainstSchema(child, previousState[childIdx], schema.values, `${path}.${childIdx}`);
      });
    }

    // 3. leaf defaulting
    else {
      const type = schema.type;
      const defaultValue = schema.default;
      const newState = type(state || defaultValue);
      if(createSanitizingReducer.trackChanges) {
        console.log(
          `[${path}] Setting leaf value`,
          `type=${type.name}`,
          `changes: ${state} => ${newState}`);
      }
      return newState;
    }
  }

  return function validatingReducer(state) {
    const _ret = checkAgainstSchema(state, previousState, rootSchema, '__root');
    previousState = _ret;
    return _ret;
  };
}
