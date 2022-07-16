'use strict'

const Just = require('src/just')
const Nothing = require('src/nothing')
const { identity, isFunction } = require('./lib/utils')

const BRAND = {}

Object.assign(MaybeJust, Just)
Object.assign(MaybeNothing, Nothing)

function MaybeJust(val) {
  return Maybe(val)
}

function MaybeNothing() {
  return Maybe(Nothing())
}

function Maybe(val) {
  let monad = val
  let isJust = MaybeJust.is(monad) && !is(monad)
  const isNothing = MaybeNothing.is(monad) && !is(monad)

  if (!isJust && !isNothing) {
    monad = Just(val)
    isJust = true
  } else if (isJust) {
    val = monad.fold(identity)
  } else {
    val = void 0
  }

  const publicAPI = {
    map,
    flatMap,
    ap,
    concat,
    fold,
    tap,
    _inspect,
    _is,
    get [Symbol.toStringTag]() {
      return `Maybe:${monad[Symbol.toStringTag]}`
    },
  }

  return publicAPI

  function map(fn) {
    return isJust ? Maybe(monad.map(fn)) : publicAPI
  }

  function flatMap(fn) {
    return isJust ? monad.flatMap(fn) : publicAPI
  }

  function ap(m) {
    return isJust ? m.map(val) : publicAPI
  }

  function concat(m) {
    return isJust ? m.map((v) => val.concat(v)) : publicAPI
  }

  function fold(asNothing, asJust) {
    return isJust ? asJust(val) : asNothing(val)
  }

  function tap(fn) {
    fn(val)
    return publicAPI
  }

  function _inspect() {
    var v = isJust ? monad._inspect().match(/^Just\((.*)\)$/)[1] : ''
    return `${publicAPI[Symbol.toStringTag]}(${v})`
  }

  function _is(br) {
    return !!(br === BRAND || monad._is(br))
  }
}

function is(val) {
  return !!(val && isFunction(val._is) && val._is(BRAND))
}

function from(val) {
  return MaybeNothing.isEmpty(val) ? MaybeNothing() : Maybe(val)
}

module.exports = Object.assign(Maybe, {
  Just: MaybeJust,
  Nothing: MaybeNothing,
  of: Maybe,
  pure: Maybe,
  unit: Maybe,
  is,
  from,
})
