module.exports = function sanitize(state, previousState, schema, path) {
  // if unchanged, return state transparently
  if(
    typeof previousState !== 'undefined' &&
    previousState !== null &&
    state === previousState) {
    return state;
  }

  // dynamic schema sourcing
  if(typeof schema === 'function') {
    schema = schema(state);
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
    return state.map((child, childIdx) => sanitize(
      child, previousState[childIdx], schema.values, `${path}.${childIdx}`
    ));
  }

  // 3. leaf defaulting
  const { type, transform, defaultValue } = schema;

  switch(type) {
    case String:
      return transform(type(state === '' ? '' : state || defaultValue));
    case Boolean:
      return transform(type((!state && state !== false) ? defaultValue : state));
    case Number:
      return transform(type(Number.isNaN(+state) ? defaultValue : state))
    default:
      return transform(type(state || defaultValue));
  }
}
