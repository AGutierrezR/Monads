const Just = require('src/just')
const { identity, inc, double, pluck } = require('./utils')

describe('Just', () => {
  describe('#unit', () => {
    it('Should create a just monad via #of', () => {
      expect(Just.of(1)._inspect()).toEqual('Just(1)')
    })

    it('Should create a just monad via #pure', () => {
      expect(Just.pure(1)._inspect()).toEqual('Just(1)')
    })

    it('Should create a just monad via #unit', () => {
      expect(Just.unit(1)._inspect()).toEqual('Just(1)')
    })

    it('Should create a Just holding an anonymous function', () => {
      expect(Just(() => {})._inspect()).toEqual('Just(anonymous function)')
    })

    it('Should create a Just holding an array of values', () => {
      expect(Just([null, undefined, false, 42, 'Hello'])._inspect()).toEqual(
        `Just([null,undefined,false,42,"Hello"])`
      )
    })
  })

  describe('#map', () => {
    it('Should follow the composition law', () => {
      expect(Just(1).map(inc).map(double)._inspect()).toEqual(
        Just(1)
          .map((x) => double(inc(x)))
          ._inspect()
      )
    })

    it('Should follow the identity law', () => {
      expect(Just(1).map(identity)._inspect()).toEqual(Just(1)._inspect())
    })

    it('Should modify the value correctly', () => {
      expect(Just(1).map(inc).map(double)._inspect()).toEqual('Just(4)')
    })
  })

  describe('#flatMap', () => {
    it(`Should return Just with 'john' as a value if has inner Just`, () => {
      expect(
        Just(Just({ name: 'john' }))
          .flatMap((person) => Just(pluck('name', person)))
          ._inspect()
      ).toEqual(Just('john')._inspect())
    })

    it(`Should return Just with 'john' as a value`, () => {
      expect(
        Just({ name: 'john' })
          .flatMap((person) => Just(pluck('name', person)))
          ._inspect()
      ).toEqual(Just('john')._inspect())
    })
  })

  describe('#fold', () => {
    it('fold(identity) extracts the value', () => {
      expect(Just(3).fold(identity)).toBe(3)
    })
  })

  describe('#ap', () => {
    it('Should apply the just inc nomad to the just 2 monad', () => {
      expect(Just.of(inc).ap(Just.of(2))._inspect()).toEqual(
        Just.of(3)._inspect()
      )
    })
  })

  describe('#concat', () => {
    it('Should concat two arrays in just monads together into a new monad', () => {
      expect(
        Just.of([1, 2])
          .concat(Just.of([3]))
          ._inspect()
      ).toEqual(Just.of([1, 2, 3])._inspect())
    })

    it('Should concat two strings in just monads together into a new monad', () => {
      expect(Just.of('Hello').concat(Just.of(' World'))._inspect()).toEqual(
        Just.of('Hello World')._inspect()
      )
    })
  })

  describe('#is', () => {
    it('Should return true if the object passed is a just monad', () => {
      expect(Just.is(Just(1))).toBeTruthy()
    })

    it('Should return false if the object passed is not a just monad', () => {
      expect(Just.is({})).toBeFalsy()
    })
  })
})
