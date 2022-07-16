const Nothing = require('src/nothing')
const { identity, inc, double, pluck } = require('./utils')

describe('Nothing', () => {
  describe('#unit', () => {
    it('Should create a Nothing via #of', () => {
      expect(Nothing.of(1)._inspect()).toEqual('Nothing()')
    })

    it('Should create a Nothing via #pure', () => {
      expect(Nothing.pure(1)._inspect()).toEqual('Nothing()')
    })

    it('Should create a Nothing via #unit', () => {
      expect(Nothing.unit(1)._inspect()).toEqual('Nothing()')
    })
  })

  describe('#map', () => {
    it('Should perform no operation', () => {
      expect(Nothing(1).map(inc).map(double)._inspect()).toEqual(
        Nothing()._inspect()
      )
    })
  })

  describe('#flatMap', () => {
    it(`Should perform no operation`, () => {
      expect(
        Nothing({ name: 'john' })
          .flatMap(pluck('name'))
          ._inspect()
      ).toEqual(Nothing()._inspect())
    })
  })

  describe('#fold', () => {
    it('fold(identity) produces undefined', () => {
      expect(Nothing().fold(identity)).toBe(undefined)
    })
  })

  describe('#ap', () => {
    it('Should perfome no operation', () => {
      expect(Nothing.of(inc).ap(Nothing.of(2))._inspect()).toEqual(
        Nothing()._inspect()
      )
    })
  })

  describe('#concat', () => {
    it('Should perfome no operation', () => {
      expect(
        Nothing.of([1, 2])
          .concat(Nothing.of([3]))
          ._inspect()
      ).toEqual(Nothing()._inspect())
    })
  })

  describe('#is', () => {
    it('Should return true if the object passed is a Nothing monad', () => {
      expect(Nothing.is(Nothing())).toBeTruthy()
    })

    it('Should return false if the object passed is not a Nothing monad', () => {
      expect(Nothing.is({})).toBeFalsy()
    })
  })
})
