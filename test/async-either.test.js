const AsyncEither = require('src/async-either')
const Either = require('src/either')
const {
  identity,
  inc,
  double,
  pluck,
  safeAwait,
  EMPTY_FUNC,
} = require('./utils')

describe('AsyncEither', () => {
  describe('AsyncEither:Right construction/creation', () => {
    it('Should create an Either:Right monad via constructor', () => {
      expect(AsyncEither(1)._inspect()).toBe('AsyncEither(Promise)')
    })

    it('Should create an AsyncEither:Right monad via of', () => {
      expect(AsyncEither.of(1)._inspect()).toBe('AsyncEither(Promise)')
    })

    it('Should create an AsyncEither:Right monad via pure', () => {
      expect(AsyncEither.pure(1)._inspect()).toBe('AsyncEither(Promise)')
    })

    it('Should create an AsyncEither:Right monad via unit', () => {
      expect(AsyncEither.unit(1)._inspect()).toBe('AsyncEither(Promise)')
    })

    it('Should create an AsyncEither:Right monad via Right', () => {
      expect(AsyncEither.Right(1)._inspect()).toBe('AsyncEither(Promise)')
    })
  })

  describe('AsyncEither:Left construction/creation', () => {
    it('Should create an Either:Left monad via constructor', () => {
      expect(AsyncEither.Left(1)._inspect()).toBe('AsyncEither(Promise)')
    })
  })

  describe('#map', () => {
    const operation = jest.fn()

    it('Should follow the identity law given an AsyncEither:Right monad', async () => {
      expect(
        await AsyncEither(1).map(identity).fold(EMPTY_FUNC, identity)
      ).toEqual(1)
    })

    it('Should follow the composition law given an AsyncEither:Right monad', async () => {
      expect(
        await AsyncEither(1)
          .map((x) => double(inc(x)))
          .fold(identity, EMPTY_FUNC)
      ).toEqual(
        await AsyncEither(1).map(inc).map(double).fold(identity, EMPTY_FUNC)
      )
    })

    it('Should return an AsyncEither:Left monad given an AsyncEither:Left monad', async () => {
      expect(
        await safeAwait(
          AsyncEither.Left(1).map(operation).fold(identity, EMPTY_FUNC)
        )
      ).toEqual(
        await safeAwait(
          AsyncEither.Left(1).map(operation).fold(identity, EMPTY_FUNC)
        )
      )
    })

    it('Should perform no operation given an Either:Left monad', () => {
      expect(operation).not.toHaveBeenCalled()
    })
  })

  describe('#flatMap', () => {
    const operation = jest.fn()

    it(`Should return an  AsyncEither:Right('john') monad`, async () => {
      expect(
        await AsyncEither({ name: 'john' })
          .flatMap((person) => AsyncEither(pluck('name', person)))
          .fold(identity, EMPTY_FUNC)
      ).toEqual(await AsyncEither('john').fold(identity, EMPTY_FUNC))
    })

    it(`Should return an AsyncEither:Left monad given an AsyncEither:Left monad`, async () => {
      expect(
        await safeAwait(
          AsyncEither.Left({ name: 'john' })
            .flatMap(operation)
            .fold(identity, EMPTY_FUNC)
        )
      ).toEqual({ name: 'john' })
    })

    it('Should perform no operation given an Either:Left monad', () => {
      expect(operation).not.toHaveBeenCalled()
    })
  })

  describe('#ap', () => {
    const operation = jest.fn()
    const operation2 = jest.fn()

    it(`Should return an AsyncEither:Right(3) monad`, async () => {
      expect(
        await AsyncEither(inc).ap(AsyncEither(2)).fold(EMPTY_FUNC, identity)
      ).toEqual(3)
    })

    it(`Should return an AsyncEither:Left(2) monad`, async () => {
      expect(
        await safeAwait(
          AsyncEither(operation)
            .ap(AsyncEither.Left(2))
            .fold(identity, EMPTY_FUNC)
        )
      ).toEqual(2)
    })

    it('Should perform no operation given an AsyncEither:Left monad', () => {
      expect(operation).not.toHaveBeenCalled()
    })

    it(`Should return an AsyncEither:Left(op) monad`, async () => {
      expect(
        await safeAwait(
          AsyncEither.Left(operation2)
            .ap(AsyncEither(2))
            .fold(identity, EMPTY_FUNC)
        )
      ).toEqual(operation2)
    })

    it('Should perform no operation given an AsyncEither:Left monad', () => {
      expect(operation2).not.toHaveBeenCalled()
    })
  })

  describe('#concat', () => {
    it(`Should return an array given an Either:Right monad and [3]`, async () => {
      expect(
        await AsyncEither([1, 2])
          .concat(AsyncEither([3]))
          .fold(EMPTY_FUNC, identity)
      ).toEqual([1, 2, 3])
    })

    it(`Should not perform a concat operation given an AsyncEither:Left monad`, async () => {
      expect(
        await safeAwait(
          AsyncEither.Left([1, 2])
            .concat(AsyncEither.Left([3]))
            .fold(identity, EMPTY_FUNC)
        )
      ).toEqual([1, 2])
    })
  })

  describe('#fold', () => {
    const operation = jest.fn()
    const operation2 = jest.fn()

    it('Should call the right side of the fold on AsyncEither:Right', async () => {
      expect(await AsyncEither('john').fold(operation, identity)).toEqual(
        'john'
      )
    })

    it('Should perform no operation given an AsyncEither:Left monad', () => {
      expect(operation).not.toHaveBeenCalled()
    })

    it('Should call the right side of the fold on AsyncEither:Right', async () => {
      expect(
        await safeAwait(AsyncEither.Left(1).fold(identity, operation2))
      ).toEqual(1)
    })

    it('Should not call the right side of the fold on AsyncEither:Left', () => {
      expect(operation2).not.toHaveBeenCalled()
    })
  })

  describe('#fromFoldable', () => {
    it('Should return an AsyncEither:Right monad given an AsyncEither:Right monad', async () => {
      expect(
        await AsyncEither.fromFoldable(Either(1)).fold(EMPTY_FUNC, identity)
      ).toEqual(1)
    })

    it('Should return an AsyncEither:Left monad from an AsyncEither:Left monad', async () => {
      expect(
        await safeAwait(
          AsyncEither.fromFoldable(Either.Left(1)).fold(
            identity,
            EMPTY_FUNC
          )
        )
      ).toEqual(1)
    })
  })
})
