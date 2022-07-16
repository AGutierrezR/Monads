const identity = (x) => x

function isFunction(v) {
  return !!(v && typeof v == 'function')
}

module.exports = {
  identity,
  isFunction,
}
