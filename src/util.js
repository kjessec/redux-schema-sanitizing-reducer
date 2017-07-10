exports.stateCompose = function stateCompose(...funcs) {
  const first = funcs[0];
  const rest = funcs.slice(1);

  return (...args) => rest.reduce((state, f) =>
    f(state, ...args.slice(1)), first(...args));
}

exports.isObject = function isObject(obj) {
  return obj === Object(obj);
}

exports.isArray = Array.isArray;
