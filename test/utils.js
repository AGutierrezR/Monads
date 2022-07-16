const identity = (x) => x
const inc = (x) => x + 1
const double = (x) => x * 2
const pluck = (key, obj) => {
  if (!obj) return (_obj) => pluck(key, _obj)
  return obj[key]
}

module.exports = {
  identity,
  inc,
  double,
  pluck,
}
