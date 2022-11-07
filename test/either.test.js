const Either = require('src/either')
const Just = require('src/just')
const Maybe = require('src/maybe')
const Nothing = require('src/nothing')
const { identity, inc, double, pluck } = require('./utils')

describe('Either', () => {
  describe('Either:Right construction/creation', () => {
    it('Shout create an Either:Right monad via constructor', () => {
      expect(Either(1)._inspect()).toBe('Either:Right(1)')
    })

    it('Shout create an Either:Right monad via of', () => {
      expect(Either.of(1)._inspect()).toBe('Either:Right(1)')
    })

    it('Shout create an Either:Right monad via pure', () => {
      expect(Either.pure(1)._inspect()).toBe('Either:Right(1)')
    })

    it('Shout create an Either:Right monad via unit', () => {
      expect(Either.unit(1)._inspect()).toBe('Either:Right(1)')
    })

    it('Shout create an Either:Right monad via Right', () => {
      expect(Either.Right(1)._inspect()).toBe('Either:Right(1)')
    })
  })

  describe('Either:Left construction/creation', () => {
    it('Shout create an Either:Right monad via constructor', () => {
      expect(Either.Left(1)._inspect()).toBe('Either:Left(1)')
    })
  })

  describe('#Left.is', () => {
    it('Should return true when the object provided is an Either:Left monad', () => {
      expect(Either.Left.is(Either.Left(1))).toBeTruthy()
    })

    it('Should return false when the object provided is not an Either:Left monad', () => {
      expect(Either.Left.is(Either(1))).toBeFalsy()
    })
  })

  describe('#Right.is', () => {
    it('Should return true when the object provided is an Either:Right monad', () => {
      expect(Either.Right.is(Either(1))).toBeTruthy()
    })

    it('Should return false when the object provided is not an Either:Right monad', () => {
      expect(Either.Right.is(Either.Left(1))).toBeFalsy()
    })
  })

  describe('#map', () => {
    const operation = jest.fn()

    it('Should follow the identity law given an Either:Right monad', () => {
      expect(Either(1).map(identity)._inspect()).toEqual(Either(1)._inspect())
    })

    it('Should follow the composition law given an Either:Right monad', () => {
      expect(
        Either(1)
          .map((x) => double(inc(x)))
          ._inspect()
      ).toEqual(Either(1).map(inc).map(double)._inspect())
    })

    it('Should return an Either:Left monad given an Either:Left monad', () => {
      expect(Either.Left(1).map(operation)._inspect()).toEqual(
        Either.Left(1)._inspect()
      )
    })

    it('Should perform no operation given an Either:Left monad', () => {
      expect(operation).not.toHaveBeenCalled()
    })
  })

  describe('#flatMap', () => {
    const operation = jest.fn()

    it(`Should return an Either:Right('john') monad`, () => {
      expect(
        Either({ name: 'john' })
          .flatMap((person) => Either(pluck('name', person)))
          ._inspect()
      ).toEqual(Either('john')._inspect())
    })

    it(`Should return an Either:Left monad given an Either:Left monad`, () => {
      expect(
        Either.Left({ name: 'john' }).flatMap(operation)._inspect()
      ).toEqual(Either.Left({ name: 'john' })._inspect())
    })

    it('Should perform no operation given an Either:Left monad', () => {
      expect(operation).not.toHaveBeenCalled()
    })
  })

  describe('#ap', () => {
    const operation = jest.fn()
    const operation2 = jest.fn()

    it(`Should return an Either:Right(3) monad`, () => {
      expect(Either(inc).ap(Either(2))._inspect()).toEqual(Either(3)._inspect())
    })

    it(`Should return an Either:Left(2) monad`, () => {
      expect(Either(operation).ap(Either.Left(2))._inspect()).toEqual(
        Either.Left(2)._inspect()
      )
    })

    it('Should perform no operation given an Either:Left monad', () => {
      expect(operation).not.toHaveBeenCalled()
    })

    it(`hould return an Either:Left(op) monad`, () => {
      expect(Either.Left(operation2).ap(Either(2))._inspect()).toEqual(
        Either.Left(operation2)._inspect()
      )
    })

    it('Should perform no operation given an Either:Left monad', () => {
      expect(operation2).not.toHaveBeenCalled()
    })
  })

  describe('#concat', () => {
    it(`Should return an array given an Either:Right monad and [3]`, () => {
      expect(
        Either([1, 2])
          .concat(Either([3]))
          ._inspect()
      ).toEqual(Either([1, 2, 3])._inspect())
    })

    it(`Should not perform a concat operation given an Either:Left monad`, () => {
      expect(
        Either.Left([1, 2])
          .concat(Either.Left([3]))
          ._inspect()
      ).toEqual(Either.Left([1, 2])._inspect())
    })
  })

  describe('#fold', () => {
    const operation = jest.fn()
    const operation2 = jest.fn()

    it('Should call the right side of the fold on Either:Right', () => {
      expect(Either('john').fold(operation, identity)).toEqual('john')
    })

    it('Should perform no operation given an Either:Left monad', () => {
      expect(operation).not.toHaveBeenCalled()
    })

    it('Should call the right side of the fold on Either:Right', () => {
      expect(Either.Left(1).fold(identity, operation2)).toEqual(1)
    })

    it('Should not call the right side of the fold on Either:Left', () => {
      expect(operation2).not.toHaveBeenCalled()
    })
  })

  describe('#attempt', () => {
    const operation1 = jest.fn()
    const operation2 = jest.fn().mockImplementation(() => {
      throw new Error('oops')
    })

    it('Should return an Either:Right monad given an success attempt', () => {
      expect(Either.Right.is(Either.attempt(operation1))).toBeTruthy()
    })

    it('Should return an Either:Left monad given an error attempt', () => {
      expect(Either.Left.is(Either.attempt(operation2))).toBeTruthy()
    })
  })

  describe('#fromFoldable', () => {
    it('Should return an Either:Right monad given an Either:Right monad', () => {
      expect(Either.fromFoldable(Either(1))._inspect()).toEqual(
        Either(1)._inspect()
      )
    })

    it('Should return an Either:Left monad from an Either:Left monad', () => {
      expect(Either.fromFoldable(Either.Left(1))._inspect()).toEqual(
        Either.Left(1)._inspect()
      )
    })

    it('Should return an Either:Left() monad given an Nothing monad', () => {
      expect(Either.fromFoldable(Nothing())._inspect()).toEqual(
        Either.Left()._inspect()
      )
    })

    it('Should return an Either:Left() monad given an Just monad', () => {
      expect(Either.fromFoldable(Just(1))._inspect()).toEqual(
        Either.Left(1)._inspect()
      )
    })

    it('Should return an Either:Left() monad given an Maybe from null (Nothing) monad', () => {
      expect(Either.fromFoldable(Maybe.from(null))._inspect()).toEqual(
        Either.Left()._inspect()
      )
    })

    it('Should return an Either:Left() monad given an Maybe from 1 monad', () => {
      expect(Either.fromFoldable(Maybe.from(1))._inspect()).toEqual(
        Either(1)._inspect()
      )
    })
  })
})
