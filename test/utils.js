const identity = (x) => x
const inc = (x) => x + 1
const double = (x) => x * 2
const pluck = (key, obj) => {
  if (!obj) return (_obj) => pluck(key, _obj)
  return obj[key]
}

const EMPTY_FUNC = () => {}

async function safeAwait(pr) {
  try {
    return await pr
  } catch (err) {
    return err
  }
}

module.exports = {
  identity,
  inc,
  double,
  pluck,
  safeAwait,
  EMPTY_FUNC,
  noop: EMPTY_FUNC,
}
