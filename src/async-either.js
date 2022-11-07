'use strict'

const Either = require('./either')
const { isFunction, isPromise, identity, EMPTY_FUNC } = require('./lib/utils')

const BRAND = {}

function AsyncLeft(v) {
  return fromPromise(isPromise(v) ? v : Promise.reject(v))
}

function AsyncRight(v) {
  return fromPromise(isPromise(v) ? v : Promise.resolve(v))
}

function AsyncEither(v) {
  return isPromise(v)
    ? fromPromise(v)
    : Either.Left.is(v)
    ? AsyncLeft(v)
    : AsyncRight(v)
}

function fromPromise(pr) {
  pr = splitPromise(pr)

  const publicAPI = {
    map,
    flatMap,
    ap,
    concat,
    fold,
    _inspect,
    _is,
    [Symbol.toStringTag]: 'AsyncEither',
  }

  return publicAPI

  function map(fn) {
    const handle = (m) =>
      m.fold(
        (leftValue) => {
          throw Either.Left(leftValue)
        },
        (rightValue) => {
          try {
            return fn(rightValue)
          } catch (error) {
            throw Either.Left(rightValue)
          }
        }
      )

    return AsyncEither(pr.then(handle, handle))
  }

  function flatMap(fn) {
    const handle = (m) =>
      m.fold(
        (leftValue) => {
          throw Either.Left(leftValue)
        },
        (rightValue) => {
          try {
            let res = fn(rightValue)

            return is(res) || Either.is(res)
              ? res.fold((lv) => {
                  throw lv
                }, identity)
              : res
          } catch (error) {
            throw Either.Left(rightValue)
          }
        }
      )

    return AsyncEither(pr.then(handle, handle))
  }

  function ap(m2) {
    // m1 is a regular Either (Left or Right)
    const handle = (m1) =>
      m1.fold(
        (leftValue) => {
          throw Either.Left(leftValue)
        },
        (fn) => {
          try {
            let res = m2.map(fn)
            // extract value from AsyncEither or Either
            if (is(res) || Either.is(res)) {
              return res.fold((lv) => {
                throw lv
              }, identity)
            }
            // otherwise, just pass the value through as-is
            return res
          } catch (err) {
            throw Either.Left(fn)
          }
        }
      )

    return AsyncEither(pr.then(handle, handle))
  }

  function concat(m2) {
    // m1 is a regular Either (Left or Right)
    const handle = (m1) =>
      m1.fold(
        (leftV) => {
          throw Either.Left(leftV)
        },
        (rightV) => {
          try {
            let res = m2.map((v) => rightV.concat(v))
            // extract value from AsyncEither or Either
            if (is(res) || Either.is(res)) {
              return res.fold((lv) => {
                throw lv
              }, identity)
            }
            // otherwise, just pass the value through as-is
            return res
          } catch (err) {
            throw Either.Left(err)
          }
        }
      )

    return AsyncEither(pr.then(handle, handle))
  }

  function fold(asLeft, asRight) {
    const handle = (witchSide) => (m) =>
      m.fold((v) => Promise.reject(witchSide(v)), witchSide)

    const pr2 = pr.then(handle(asRight), handle(asLeft))

    pr2.catch(EMPTY_FUNC)
    return pr2
  }

  function _inspect() {
    return `${publicAPI[Symbol.toStringTag]}(Promise)`
  }

  function _is(br) {
    return br === BRAND
  }
}

function is(val) {
  return !!(val && isFunction(val._is) && val._is(BRAND))
}

function fromFoldable(m) {
  return m.fold(AsyncEither.Left, AsyncEither.Right)
}

function splitPromise(pr) {
  const pr2 = pr.then(
    (v) => (Either.is(v) ? v : Either.Right(v)),
    (v) => Promise.reject(Either.is(v) ? v : Either.Left(v))
  )

  pr2.catch(EMPTY_FUNC)
  return pr2
}

module.exports = Object.assign(AsyncEither, {
  Left: AsyncLeft,
  Right: AsyncRight,
  of: AsyncRight,
  pure: AsyncRight,
  unit: AsyncRight,
  is,
  fromFoldable,
})
