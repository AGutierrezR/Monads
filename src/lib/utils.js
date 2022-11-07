const identity = (x) => x

function isFunction(v) {
  return !!(v && typeof v == 'function')
}

function isPromise(v) {
  return !!(v && isFunction(v.then))
}

const EMPTY_FUNC = () => {}

module.exports = {
  identity,
  isFunction,
  isPromise,
  EMPTY_FUNC,
  noop: EMPTY_FUNC,
}
