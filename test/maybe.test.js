const Just = require('src/just')
const Maybe = require('src/maybe')
const { identity, inc, double, pluck } = require('./utils')

describe('Maybe', () => {
  describe('#Just', () => {
    it('Should create a Maybe:Just monad via constructor', () => {
      expect(Maybe(1)._inspect()).toEqual('Maybe:Just(1)')
    })

    it('Should create a Maybe:Just monad via #of', () => {
      expect(Maybe.of(1)._inspect()).toEqual('Maybe:Just(1)')
    })

    it('Should create a Maybe:Just monad via #pure', () => {
      expect(Maybe.pure(1)._inspect()).toEqual('Maybe:Just(1)')
    })

    it('Should create a Maybe:Just monad via #unit', () => {
      expect(Maybe.unit(1)._inspect()).toEqual('Maybe:Just(1)')
    })

    it('Should create a Maybe:Just monad via #Just', () => {
      expect(Maybe.Just(1)._inspect()).toEqual(Maybe(1)._inspect())
    })

    it('Should create a Maybe:Just monad from a Just value', () => {
      expect(Maybe.of(Just.of(1))._inspect()).toEqual('Maybe:Just(1)')
    })

    it('Should create a Maybe:Just(Maybe:Just) monad from a Maybe:Just value', () => {
      expect(Maybe.of(Maybe.of(1))._inspect()).toEqual(
        'Maybe:Just(Maybe:Just(1))'
      )
    })
  })

  describe('#Nothing', () => {
    it('Should create a Maybe:Nothing monad', () => {
      expect(Maybe.Nothing()._inspect()).toEqual('Maybe:Nothing()')
    })
  })

  describe('#map', () => {
    const operation = jest.fn()

    it('Should follow the composition law for a Maybe:Just monad', () => {
      expect(Maybe(1).map(inc).map(double)._inspect()).toEqual(
        Maybe(1)
          .map((x) => double(inc(x)))
          ._inspect()
      )
    })

    it('Should follow the identity law for a Maybe:Just monad', () => {
      expect(Maybe(1).map(identity)._inspect()).toEqual(Maybe(1)._inspect())
    })

    it('Should modify the value correctly', () => {
      expect(Maybe(1).map(inc).map(double)._inspect()).toEqual('Maybe:Just(4)')
    })

    it('Should perfome no operation on a Maybe:Nothing monad', () => {
      expect(Maybe.Nothing().map(operation)._inspect()).toEqual(
        Maybe.Nothing()._inspect()
      )
      expect(operation).not.toHaveBeenCalled()
    })
  })

  describe('#flatMap', () => {
    const operation = jest.fn(() => Maybe.of(1))
    const operation2 = jest.fn()

    beforeEach(() => {
      operation.mockClear()
      operation2.mockClear()
    })

    it(`Should return just with 'john' as a value`, () => {
      expect(
        Maybe({ name: 'john' })
          .flatMap((person) => Maybe.from(pluck('name', person)))
          ._inspect()
      ).toEqual(Maybe.Just('john')._inspect())
    })

    it.todo('Should return a Nothing monad if operation return Nothing')

    it(`Should perform no operation on a Maybe:Nothing monad`, () => {
      expect(Maybe.Nothing().flatMap(operation)._inspect()).toEqual(
        Maybe.Nothing()._inspect()
      )
    })

    it('Should perform operation until a Maybe:Nothing monad is hit', () => {
      expect(
        Maybe.of(1)
          .flatMap(operation)
          .flatMap(() => Maybe.from(undefined))
          .flatMap(operation2)
          ._inspect()
      ).toEqual(Maybe.Nothing()._inspect())

      expect(operation).toHaveBeenCalled()
      expect(operation2).not.toHaveBeenCalled()
    })
  })

  describe('#fold', () => {
    const op1 = jest.fn()
    const op2 = jest.fn()

    it('should call the right side of the fold on Maybe:Just', () => {
      expect(Maybe.Just('john').fold(op1, identity)).toEqual('john')
    })

    it('should not call the left side of the fold on Maybe:Just', () => {
      expect(op1).not.toHaveBeenCalled()
    })

    it('Should call the left side of the fold on Maybe:Nothing', () => {
      expect(Maybe.Nothing().fold(() => 'no-value', op2)).toEqual('no-value')
    })

    it('Should not call the left side of the fold on Maybe:Nothing', () => {
      expect(op2).not.toHaveBeenCalled()
    })
  })

  describe('#is', () => {
    it('Should return true if a Maybe:Just monad is passed as argument', () => {
      expect(Maybe.is(Maybe.Just(1))).toBeTruthy()
    })
    it('Should return true if a Maybe:Nothing monad is passed as argument', () => {
      expect(Maybe.is(Maybe.Nothing())).toBeTruthy()
    })
    it('Should return false if a Maybe monad is not passed as argument', () => {
      expect(Maybe.is({})).toBeFalsy()
    })
  })

  describe('#from', () => {
    it('Should create a Maybe:Just monad from a value', () => {
      expect(Maybe.from(1)._inspect()).toEqual(Maybe.Just(1)._inspect())
    })

    it('Should create a Maybe:Nothing monad from an empty value', () => {
      expect(Maybe.from(null)._inspect()).toEqual(Maybe.Nothing()._inspect())
      expect(Maybe.from(undefined)._inspect()).toEqual(
        Maybe.Nothing()._inspect()
      )
    })
  })

  describe('#ap', () => {
    it('Should apply the just inc nomad to the just 2 monad', () => {
      expect(Maybe.of(inc).ap(Maybe.of(2))._inspect()).toEqual(
        Maybe.of(3)._inspect()
      )
    })
  })

  describe('#concat', () => {
    it('Should concat two arrays in just monads together into a new monad', () => {
      expect(
        Maybe.of([1, 2])
          .concat(Maybe.of([3]))
          ._inspect()
      ).toEqual(Maybe.of([1, 2, 3])._inspect())
    })

    it('Should concat two strings in just monads together into a new monad', () => {
      expect(Maybe.of('Hello').concat(Maybe.of(' World'))._inspect()).toEqual(
        Maybe.of('Hello World')._inspect()
      )
    })
  })
})
