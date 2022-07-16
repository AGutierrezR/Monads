'use strict'

const { isFunction } = require('./lib/utils')

const BRAND = {}

function Nothing() {
  const publicAPI = {
    map: noop,
    flatMap: noop,
    fold,
    ap: noop,
    concat: noop,
    _inspect,
    _is,
    [Symbol.toStringTag]: 'Nothing',
  }

  return publicAPI

  function noop() {
    return publicAPI
  }

  function fold(fn) {
    return fn()
  }

  function _inspect() {
    return `${publicAPI[Symbol.toStringTag]}()`
  }

  function _is(br) {
    return br === BRAND
  }
}

function is(val) {
  return !!(val && isFunction(val._is) && val._is(BRAND))
}

function isEmpty(val) {
  return val == null
}

module.exports = Object.assign(Nothing, {
  of: Nothing,
  pure: Nothing,
  unit: Nothing,
  is,
  isEmpty,
})
