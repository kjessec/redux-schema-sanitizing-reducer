'use strict';
import { createSanitizingReducer } from './';

export default function sanitize(state, previousState, schema, path) {
  // if unchanged, return state transparently
  if(
    typeof previousState !== 'undefined' &&
    previousState !== null &&
    state === previousState) {
    if(createSanitizingReducer.trackChanges) {
      console.log(`[${path}] Returning state as is since equality check passes`);
    }

    return state;
  }

  // ...
  if(createSanitizingReducer.trackChanges) {
    console.log(`[${path}] Sanitizing since equality check fails`);
  }

  // if changed, do something..
  // 1. object sanitizing
  if(schema.type === Object) {
    // if 'allow-all' schema, return state as is
    if(typeof schema.values === 'undefined') return state;

    // apply schema to children
    state = state || {};
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
        dirtyState[key] = sanitize(
          targetLeaf, previousLeaf, schemaLeaf, `${path}.${key}`
        );
      }
    });

    return dirtyState;
  }

  // 2. array sanitizing
  else if(schema.type === Array) {
    // if 'allow-all' schema, return state as is
    if(typeof schema.values === 'undefined') return state;

    // apply schema to children
    state = state || [];
    previousState = previousState || [];
    return state.map(function(child, childIdx) {
      return sanitize(
        child, previousState[childIdx], schema.values, `${path}.${childIdx}`
      );
    });
  }

  // 3. leaf defaulting
  else {
    const type = schema.type;
    const defaultValue = schema.default;
    const newState = type === String
      ? type(state === '' ? '' : state || defaultValue || type())
      : type(state || defaultValue || type());

    if(createSanitizingReducer.trackChanges) {
      console.log(
        `[${path}] Sanitizing leaf value`,
        `type=${type.name}`,
        `applied: ${state} => ${newState}`);
    }

    return newState;
  }
}
