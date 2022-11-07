'use strict'

const Just = require('./just')
const { isFunction } = require('./lib/utils')

const BRAND = {}

Left.is = LeftIs
Right.is = RightIs

function Left(val) {
  return LeftOrRight(val, false)
}

function LeftIs(val) {
  return is(val) && !val._is_right()
}

function Right(val) {
  return LeftOrRight(val, true)
}

function RightIs(val) {
  return is(val) && val._is_right()
}

function Either(val) {
  return LeftOrRight(val, true)
}

function LeftOrRight(val, isRight) {
  var publicAPI = {
    map,
    flatMap,
    ap,
    concat,
    fold,
    _inspect,
    _is,
    _is_right,
    get [Symbol.toStringTag]() {
      return `Either:${isRight ? 'Right' : 'Left'}`
    },
  }

  return publicAPI

  function map(fn) {
    return isRight ? LeftOrRight(fn(val), isRight) : publicAPI
  }

  function flatMap(fn) {
    return isRight ? fn(val) : publicAPI
  }

  function ap(m) {
    return isRight ? m.map(val) : publicAPI
  }

  function concat(m) {
    return isRight ? m.map((v) => val.concat(v)) : publicAPI
  }

  function fold(asLeft, asRight) {
    return isRight ? asRight(val) : asLeft(val)
  }

  function _inspect() {
    var v = Just(val)
      ._inspect()
      .match(/^Just\((.*)\)$/)[1]
    return `${publicAPI[Symbol.toStringTag]}(${v})`
  }

  function _is(br) {
    return br === BRAND
  }

  function _is_right() {
    return isRight
  }
}

function attempt(fn) {
  try {
    return Right(fn())
  } catch (error) {
    return Left(error)
  }
}

function is(val) {
  return !!(val && isFunction(val._is) && val._is(BRAND))
}

function fromFoldable(m) {
  return m.fold(Left, Right)
}

module.exports = Object.assign(Either, {
  Left,
  Right,
  of: Right,
  pure: Right,
  unit: Right,
  attempt,
  is,
  fromFoldable,
})
