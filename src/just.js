'use strict'

const { isFunction } = require('./lib/utils')

const BRAND = {}

function Just(val) {
  const publicAPI = {
    map,
    flatMap,
    fold,
    ap,
    concat,
    tap,
    _inspect,
    _is,
    [Symbol.toStringTag]: 'Just',
  }

  return publicAPI

  function map(fn) {
    return Just(fn(val))
  }

  // AKA: chain, bind
  function flatMap(fn) {
    if (is(val)) {
      return fn(val.fold((x) => x))
    }

    return fn(val)
  }

  // Same as flatMap but,
  // it doesn't expect a Just return
  function fold(fn) {
    return fn(val)
  }

  function ap(monad) {
    return monad.map(val)
  }

  function concat(monad) {
    return monad.map((v) => val.concat(v))
  }

  function tap(fn) {
    fn(val)
    return publicAPI
  }

  function _inspect() {
    return `${publicAPI[Symbol.toStringTag]}(${_serialize(val)})`
  }

  function _is(br) {
    return br === BRAND
  }

  function _serialize(val) {
    if (typeof val == 'string') return `"${val}"`
    if (typeof val == 'undefined') return ''
    if (isFunction(val)) return val.name || 'anonymous function'
    if (val && isFunction(val._inspect)) return val._inspect()
    if (Array.isArray(val))
      return `[${val.map((v) => (v == null ? String(v) : _serialize(v)))}]`
    return String(val)
  }
}

function is(val) {
  return !!(val && isFunction(val._is) && val._is(BRAND))
}

module.exports = Object.assign(Just, {
  of: Just,
  pure: Just,
  unit: Just,
  is,
})
